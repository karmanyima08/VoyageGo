"""FastAPI route definitions."""

from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from typing import List, Optional
import json
import base64
import re
from pathlib import Path
from datetime import datetime

from app.database.database import get_db
from app.models.db_models import Trip, Favourite, User
from app.schemas.schemas import (
    TripGenerateRequest, TripCreate, TripUpdate, TripResponse,
    FavouriteCreate, FavouriteResponse, PlaceImageUpdate, DestinationImageUpdate,
    ImageUploadPayload, UserRegister, UserLogin, UserResponse, AuthResponse
)
from app.services import data_service, ml_service, auth_service
from app.ml import evaluation

router = APIRouter()


# ─── Health ───────────────────────────────────────────────────────────────────

@router.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


# ─── User Authentication ──────────────────────────────────────────────────────

@router.post("/auth/register")
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    """Registers a new user with hashed password and generates a JWT token."""
    clean_email = payload.email.strip().lower()
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    hashed_pw = auth_service.hash_password(payload.password)
    user = User(
        name=payload.name.strip(),
        email=clean_email,
        hashed_password=hashed_pw,
        travel_vibe=payload.travel_vibe or "Balanced Explorer",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = auth_service.create_access_token(user.id, user.email, user.name)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "travel_vibe": user.travel_vibe,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }
    }


@router.post("/auth/login")
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticates user credentials and returns JWT token."""
    clean_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    if not user or not auth_service.verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = auth_service.create_access_token(user.id, user.email, user.name)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "travel_vibe": user.travel_vibe,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }
    }


@router.post("/auth/demo-login")
def demo_login(db: Session = Depends(get_db)):
    """1-Click login specifically for examiners and faculty during project evaluation."""
    demo_email = "evaluator@voyageml.edu"
    user = db.query(User).filter(User.email == demo_email).first()
    if not user:
        user = User(
            name="Project Examiner (Faculty)",
            email=demo_email,
            hashed_password=auth_service.hash_password("ExaminerPass2026!"),
            travel_vibe="Academic Evaluator",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = auth_service.create_access_token(user.id, user.email, user.name)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "travel_vibe": user.travel_vibe,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }
    }


@router.get("/auth/me")
def get_current_user(token: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """Retrieves current user details from JWT token."""
    if not token:
        raise HTTPException(status_code=401, detail="Authentication token required")
    payload = auth_service.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(User).filter(User.id == payload.get("user_id")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "travel_vibe": user.travel_vibe,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


# ─── Destinations ─────────────────────────────────────────────────────────────

@router.get("/destinations")
def list_destinations(
    search: Optional[str] = None,
    category: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_budget: Optional[float] = None,
    sort_by: str = "avg_rating",
):
    destinations = data_service.get_all_destinations(search, category, min_rating, max_budget, sort_by)
    return {"destinations": destinations, "total": len(destinations)}


@router.get("/destinations/names")
def get_destination_names():
    destinations = data_service.get_all_destinations()
    return {"names": [d["destination"] for d in destinations]}


@router.get("/destinations/{name}")
def get_destination(name: str):
    dest = data_service.get_destination_by_name(name)
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    places = data_service.get_places_for_destination(name)
    return {"destination": dest, "places": places}


# ─── Places & Image Editing ───────────────────────────────────────────────────

@router.get("/places")
def list_places(destination: Optional[str] = None, search: Optional[str] = None):
    places = data_service.get_all_places(destination=destination, search=search)
    return {"places": places, "total": len(places)}


@router.put("/places/image")
def update_place_image_endpoint(payload: PlaceImageUpdate, db: Session = Depends(get_db)):
    """Allows user to customize/edit the image URL for any place."""
    success = data_service.update_place_image(
        place_name=payload.place_name,
        image_url=payload.image_url,
        destination=payload.destination
    )
    if not success:
        raise HTTPException(status_code=404, detail=f"Place '{payload.place_name}' not found")
    
    # Update image in any active trip itineraries in database
    trips = db.query(Trip).all()
    updated_trips = 0
    for trip in trips:
        itinerary = trip.itinerary
        if not itinerary:
            continue
        modified = False
        # If stored as string, decode
        if isinstance(itinerary, str):
            try:
                itinerary = json.loads(itinerary)
            except Exception:
                continue
        
        if isinstance(itinerary, dict):
            for day_data in itinerary.values():
                for place in day_data.get("places", []):
                    if place.get("place_name", "").strip().lower() == payload.place_name.strip().lower():
                        place["image"] = payload.image_url.strip()
                        modified = True
        
        if modified:
            trip.itinerary = json.loads(json.dumps(itinerary))
            flag_modified(trip, "itinerary")
            updated_trips += 1
            
    if updated_trips > 0:
        db.commit()

    return {
        "success": True,
        "place_name": payload.place_name,
        "image_url": payload.image_url,
        "trips_updated": updated_trips,
        "message": f"Successfully updated image for '{payload.place_name}'"
    }


@router.put("/destinations/image")
def update_destination_image_endpoint(payload: DestinationImageUpdate, db: Session = Depends(get_db)):
    """Allows user to customize/edit the hero image URL for any destination."""
    success = data_service.update_destination_image(
        destination=payload.destination,
        image_url=payload.image_url
    )
    if not success:
        raise HTTPException(status_code=404, detail=f"Destination '{payload.destination}' not found")
    
    return {
        "success": True,
        "destination": payload.destination,
        "image_url": payload.image_url,
        "message": f"Successfully updated hero image for '{payload.destination}'"
    }


@router.post("/upload-image")
def upload_image(payload: ImageUploadPayload, db: Session = Depends(get_db)):
    """
    Accepts a base64 encoded photo from the user's laptop and saves it locally.
    Stores the file in both backend/uploads and frontend/public/uploads,
    and automatically updates places.csv or destinations.csv and database trips.
    """
    if not payload.data_base64:
        raise HTTPException(status_code=400, detail="No image data provided")

    raw_data = payload.data_base64
    # Strip data URL prefix if present (e.g. data:image/jpeg;base64,...)
    if "," in raw_data:
        _, raw_data = raw_data.split(",", 1)

    try:
        image_bytes = base64.b64decode(raw_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 image data: {str(e)}")

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    # Detect extension
    ext = ".jpg"
    orig_name = payload.filename or "photo.jpg"
    if "." in orig_name:
        detected_ext = orig_name.rsplit(".", 1)[1].lower()
        if detected_ext in ["jpg", "jpeg", "png", "webp", "gif", "avif"]:
            ext = f".{detected_ext}"

    # Generate safe unique filename
    label = payload.place_name or payload.destination or "photo"
    clean_label = re.sub(r"[^a-zA-Z0-9_-]", "_", label.strip().lower())[:35]
    timestamp = int(datetime.now().timestamp() * 1000)
    filename = f"{clean_label}_{timestamp}{ext}"

    # Directory targets
    backend_uploads = Path(__file__).resolve().parent.parent.parent / "uploads"
    frontend_uploads = Path(__file__).resolve().parent.parent.parent.parent / "frontend" / "public" / "uploads"

    backend_uploads.mkdir(parents=True, exist_ok=True)
    frontend_uploads.mkdir(parents=True, exist_ok=True)

    backend_file = backend_uploads / filename
    frontend_file = frontend_uploads / filename

    try:
        with open(backend_file, "wb") as f:
            f.write(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image to backend storage: {str(e)}")

    try:
        with open(frontend_file, "wb") as f:
            f.write(image_bytes)
    except Exception:
        pass

    public_url = f"/uploads/{filename}"

    # Update places.csv and database trips if for a place
    trips_updated = 0
    if payload.item_type == "place" and payload.place_name:
        data_service.update_place_image(
            place_name=payload.place_name,
            image_url=public_url,
            destination=payload.destination
        )
        trips = db.query(Trip).all()
        for trip in trips:
            itinerary = trip.itinerary
            if not itinerary:
                continue
            modified = False
            if isinstance(itinerary, str):
                try:
                    itinerary = json.loads(itinerary)
                except Exception:
                    continue
            if isinstance(itinerary, dict):
                for day_data in itinerary.values():
                    for place in day_data.get("places", []):
                        if place.get("place_name", "").strip().lower() == payload.place_name.strip().lower():
                            place["image"] = public_url
                            modified = True
            if modified:
                trip.itinerary = json.loads(json.dumps(itinerary))
                flag_modified(trip, "itinerary")
                trips_updated += 1
        if trips_updated > 0:
            db.commit()

    elif payload.item_type == "destination" and payload.destination:
        data_service.update_destination_image(
            destination=payload.destination,
            image_url=public_url
        )

    return {
        "success": True,
        "image_url": public_url,
        "filename": filename,
        "trips_updated": trips_updated,
        "place_name": payload.place_name,
        "destination": payload.destination,
        "message": f"Successfully uploaded photo as {filename}"
    }



# ─── Trip Generation ──────────────────────────────────────────────────────────

@router.post("/trips/generate")
def generate_trip(request: TripGenerateRequest, db: Session = Depends(get_db)):
    """Main ML pipeline endpoint."""
    user_input = request.model_dump()

    result = ml_service.run_ml_pipeline(user_input)

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    # Auto-cleanup old ephemeral guest trips older than 2 hours so they don't accumulate forever
    try:
        from datetime import timedelta
        cutoff = datetime.now() - timedelta(hours=2)
        db.query(Trip).filter(
            (Trip.status == "guest_temp") | (Trip.user_id == None),
            Trip.created_at < cutoff
        ).delete()
        db.commit()
    except Exception:
        pass

    is_signed_up = bool(request.user_id and request.user_email and request.user_email != "demo")
    session_key = request.user_email.strip().lower() if is_signed_up else "guest_temp"
    status_val = "active" if is_signed_up else "guest_temp"

    start_d = result.get("start_date") or request.start_date
    end_d = result.get("end_date") or request.end_date
    trip = Trip(
        user_id=request.user_id if is_signed_up else None,
        user_session=session_key,
        name=f"Trip to {request.destination}",
        destination=request.destination,
        days=request.days,
        start_date=start_d,
        end_date=end_d,
        group_size=request.group_size,
        budget=request.budget,
        status=status_val,
        ml_results=result,
        itinerary=result.get("itinerary", {}),
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)

    return {"trip_id": trip.id, "is_guest": not is_signed_up, **result}


# ─── Trips CRUD ───────────────────────────────────────────────────────────────

@router.get("/trips")
def list_trips(user_session: Optional[str] = None, user_id: Optional[int] = None, db: Session = Depends(get_db)):
    # Auto-cleanup: purge any old guest temp trips older than 2 hours
    try:
        from datetime import timedelta
        cutoff = datetime.now() - timedelta(hours=2)
        db.query(Trip).filter(
            (Trip.status == "guest_temp") | (Trip.user_id == None),
            Trip.created_at < cutoff
        ).delete()
        db.commit()
    except Exception:
        pass

    # If user is not authenticated / signed up, return empty list so no random trips appear!
    if not user_id and (not user_session or user_session in ["demo", "guest", "guest_temp", "null", "undefined"]):
        return {"trips": []}

    query = db.query(Trip).filter(Trip.status == "active")
    if user_id:
        query = query.filter((Trip.user_id == user_id) | (Trip.user_session == user_session))
    else:
        query = query.filter(Trip.user_session == user_session)

    trips = query.order_by(Trip.created_at.desc()).all()
    return {"trips": [
        {
            "id": t.id,
            "name": t.name,
            "destination": t.destination,
            "days": t.days,
            "start_date": t.start_date or (t.ml_results.get("start_date") if t.ml_results else None),
            "end_date": t.end_date or (t.ml_results.get("end_date") if t.ml_results else None),
            "date_range_label": (t.ml_results.get("date_range_label") if t.ml_results else None) or (f"{t.start_date} – {t.end_date}" if t.start_date and t.end_date else t.start_date),
            "group_size": t.group_size,
            "budget": t.budget,
            "status": t.status,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "total_cost": t.ml_results.get("total_estimated_cost") if t.ml_results else None,
            "staying_cost_per_day": t.ml_results.get("staying_cost_per_day") if t.ml_results else None,
            "travelling_cost_per_day": t.ml_results.get("travelling_cost_per_day") if t.ml_results else None,
            "hotel_name": t.ml_results.get("stay_details", {}).get("name") if t.ml_results else None,
            "vehicle_name": t.ml_results.get("transport_details", {}).get("vehicle_name") if t.ml_results else None,
            "image": t.ml_results.get("destination_info", {}).get("image") if t.ml_results else None,
            "traveller_profile": t.ml_results.get("traveller_profile", {}).get("label") if t.ml_results else None,
            "weather_condition": t.ml_results.get("weather_info", {}).get("condition") if t.ml_results else None,
            "weather_icon": t.ml_results.get("weather_info", {}).get("icon") if t.ml_results else None,
            "weather_temp": t.ml_results.get("weather_info", {}).get("temperature") if t.ml_results else None,
        }
        for t in trips
    ]}


@router.post("/trips/{trip_id}/save-to-account")
def claim_trip(
    trip_id: int,
    user_id: int = Query(...),
    user_email: str = Query(...),
    db: Session = Depends(get_db)
):
    """Saves a temporary guest trip permanently to a signed-up user account."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    trip.user_id = user_id
    trip.user_session = user_email.strip().lower()
    trip.status = "active"
    db.commit()
    db.refresh(trip)
    return {"success": True, "message": "Trip successfully saved to your account!", "trip_id": trip.id}


@router.get("/trips/{trip_id}")
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    ml = trip.ml_results
    if isinstance(ml, str):
        try:
            ml = json.loads(ml)
        except Exception:
            ml = {}

    itin = trip.itinerary
    if isinstance(itin, str):
        try:
            itin = json.loads(itin)
        except Exception:
            itin = {}

    start_d = trip.start_date or (ml.get("start_date") if isinstance(ml, dict) else None)
    end_d = trip.end_date or (ml.get("end_date") if isinstance(ml, dict) else None)
    date_lbl = (ml.get("date_range_label") if isinstance(ml, dict) else None) or (
        f"{start_d} – {end_d}" if start_d and end_d else start_d
    )

    return {
        "id": trip.id,
        "name": trip.name,
        "destination": trip.destination,
        "days": trip.days,
        "start_date": start_d,
        "end_date": end_d,
        "date_range_label": date_lbl,
        "group_size": trip.group_size,
        "budget": trip.budget,
        "status": trip.status,
        "ml_results": ml,
        "itinerary": itin,
        "created_at": trip.created_at.isoformat() if trip.created_at else None,
    }


@router.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    """Deletes a saved trip by ID."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return {"success": True, "message": f"Trip #{trip_id} deleted successfully"}


@router.put("/trips/{trip_id}")
def update_trip(trip_id: int, update: TripUpdate, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if update.name:
        trip.name = update.name
    if update.itinerary is not None:
        trip.itinerary = update.itinerary
        # Recalculate costs from updated itinerary
        if trip.ml_results:
            new_ml = dict(trip.ml_results)
            # Update budget breakdown activities cost
            total_act_cost = sum(
                sum(int(p.get("average_cost", 0)) for p in day.get("places", []))
                for day in update.itinerary.values()
            )
            if "budget_breakdown" in new_ml:
                new_ml["budget_breakdown"]["activities"] = total_act_cost
                base = sum(v for k, v in new_ml["budget_breakdown"].items() if k != "activities" and k != "total")
                new_ml["budget_breakdown"]["total"] = base + total_act_cost
                new_ml["total_estimated_cost"] = new_ml["budget_breakdown"]["total"]
                new_ml["budget_remaining"] = max(0, trip.budget - new_ml["total_estimated_cost"])
            trip.ml_results = new_ml
    if update.status:
        trip.status = update.status
    db.commit()
    db.refresh(trip)
    return {"id": trip.id, "ml_results": trip.ml_results, "itinerary": trip.itinerary}


@router.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted"}


# ─── Favourites ───────────────────────────────────────────────────────────────

@router.post("/favourites")
def add_favourite(fav: FavouriteCreate, db: Session = Depends(get_db)):
    existing = db.query(Favourite).filter(
        Favourite.user_session == fav.user_session,
        Favourite.item_id == fav.item_id,
    ).first()
    if existing:
        return {"id": existing.id, "message": "Already in favourites"}

    db_fav = Favourite(**fav.model_dump())
    db.add(db_fav)
    db.commit()
    db.refresh(db_fav)
    return {"id": db_fav.id, "message": "Added to favourites"}


@router.get("/favourites")
def get_favourites(user_session: str = "demo", db: Session = Depends(get_db)):
    favs = db.query(Favourite).filter(Favourite.user_session == user_session).all()
    return {"favourites": [
        {"id": f.id, "item_type": f.item_type, "item_id": f.item_id,
         "item_name": f.item_name, "item_image": f.item_image,
         "created_at": f.created_at.isoformat() if f.created_at else None}
        for f in favs
    ]}


@router.delete("/favourites/{fav_id}")
def remove_favourite(fav_id: int, db: Session = Depends(get_db)):
    fav = db.query(Favourite).filter(Favourite.id == fav_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favourite not found")
    db.delete(fav)
    db.commit()
    return {"message": "Removed from favourites"}


# ─── ML Endpoints ─────────────────────────────────────────────────────────────

@router.get("/ml/metrics")
def get_ml_metrics():
    return evaluation.get_all_metrics()


@router.get("/ml/classification")
def get_classification_metrics():
    return evaluation.get_classification_results()


@router.get("/ml/clustering")
def get_clustering_metrics():
    return evaluation.get_clustering_results()


@router.get("/ml/regression")
def get_regression_metrics():
    return evaluation.get_regression_results()


@router.get("/ml/feature-importance")
def get_feature_importance():
    clf_results = evaluation.get_classification_results()
    if "error" in clf_results:
        return clf_results
    return {"feature_importance": clf_results.get("feature_importance", [])}


@router.post("/ml/train")
def train_models(background_tasks: BackgroundTasks):
    """Trigger model training (runs in background)."""
    def do_train():
        import sys
        from pathlib import Path
        sys.path.insert(0, str(Path(__file__).parent.parent.parent))
        from app.ml.train import train_all
        train_all()

    background_tasks.add_task(do_train)
    return {"message": "Model training started in background. Check /api/ml/metrics for status."}


@router.get("/ml/dataset-stats")
def get_dataset_stats():
    return evaluation.get_dataset_stats()
