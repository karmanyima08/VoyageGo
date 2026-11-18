"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class TripGenerateRequest(BaseModel):
    destination: str = Field(..., description="Selected destination")
    budget: float = Field(..., gt=0, description="Total budget in INR")
    days: int = Field(..., ge=1, le=30)
    group_size: int = Field(1, ge=1, le=20)
    food_preference: str = Field("No Preference")
    nature_interest: int = Field(3, ge=1, le=5)
    adventure_interest: int = Field(3, ge=1, le=5)
    food_interest: int = Field(3, ge=1, le=5)
    history_interest: int = Field(3, ge=1, le=5)
    shopping_interest: int = Field(3, ge=1, le=5)
    culture_interest: int = Field(3, ge=1, le=5)
    walking_comfort: str = Field("Medium")
    accommodation_type: str = Field("Standard")
    transport_preference: str = Field("Mixed")
    vehicle_ownership: Optional[str] = Field("Rental", description="Private or Rental")
    vehicle_type: Optional[str] = Field("Hatchback", description="Two-Wheeler, Hatchback, Sedan, SUV")
    trip_pace: str = Field("Balanced")
    group_type: str = Field("Friends")
    start_date: Optional[str] = Field(None, description="Start date of trip YYYY-MM-DD")
    end_date: Optional[str] = Field(None, description="End date of trip YYYY-MM-DD")
    user_id: Optional[int] = Field(None, description="Logged in user id")
    user_email: Optional[str] = Field(None, description="Logged in user email")
    additional_notes: Optional[str] = None


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    travel_vibe: Optional[str] = "Balanced Explorer"


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    travel_vibe: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    token: str
    user: UserResponse


class TripCreate(BaseModel):
    name: str
    destination: str
    days: int
    group_size: int = 1
    budget: float
    user_session: str = "demo"


class TripUpdate(BaseModel):
    name: Optional[str] = None
    itinerary: Optional[Dict] = None
    status: Optional[str] = None


class TripResponse(BaseModel):
    id: int
    name: str
    destination: str
    days: int
    group_size: int
    budget: float
    status: str
    ml_results: Optional[Dict] = None
    itinerary: Optional[Dict] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PlaceImageUpdate(BaseModel):
    place_name: str
    destination: Optional[str] = None
    image_url: str


class DestinationImageUpdate(BaseModel):
    destination: str
    image_url: str


class ImageUploadPayload(BaseModel):
    filename: str
    data_base64: str
    place_name: Optional[str] = None
    destination: Optional[str] = None
    item_type: str = "place"


class FavouriteCreate(BaseModel):
    item_type: str = "destination"
    item_id: str
    item_name: str
    item_image: Optional[str] = None
    user_session: str = "demo"


class FavouriteResponse(BaseModel):
    id: int
    item_type: str
    item_id: str
    item_name: str
    item_image: Optional[str]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DestinationResponse(BaseModel):
    id: int
    destination: str
    country: str
    region: Optional[str]
    image: Optional[str]
    description: Optional[str]
    avg_rating: float
    avg_cost_per_day: float
    best_duration_days: int
    categories: Optional[List[str]]
    best_season: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        from_attributes = True
