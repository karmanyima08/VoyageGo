# VoyageGo — Intelligent Travel Itinerary & Budget Planner

An end-to-end **Machine Learning–powered travel planning platform** built with **FastAPI**, **scikit-learn**, and **React + TypeScript (Vite)**. VoyageGo generates personalized, budget-aware, day-by-day travel itineraries across 20 curated Indian destinations by combining classification, clustering, regression, and constraint optimization.

---

## Features

- **Personalized ML Trip Planner:** Scores and ranks attractions based on 6 interest dimensions (Nature, Adventure, Food, History, Shopping, Culture), walking comfort, trip pace, group size, accommodation tier, and transport preferences.
- **Multi-Model ML Pipeline:**
  - **Classification** (*Random Forest*, compared against *Logistic Regression* & *Decision Tree*) to predict the probability a traveller will enjoy each place.
  - **Clustering** (*K-Means*) to segment travellers into behavioural profiles (e.g., *Budget Explorer*, *Luxury Seeker*, etc.).
  - **Regression** to estimate total trip cost and activity duration.
  - **Constraint Checker** to balance daily schedules against budget limits and available hours.
- **20 Curated Indian Destinations:** Rich destination & attraction catalog (Goa, Jaipur, Kerala Backwaters, Manali, Agra, Mumbai, Leh Ladakh, Rishikesh, Udaipur, Varanasi, Coorg, Darjeeling, Hampi, Andaman Islands, Kolkata, Mysore, Spiti Valley, Ooty, Jaisalmer, Munnar) with curated photography and seasonal weather advisories.
- **ML Analytics Dashboard:** Interactive visualizations of model comparison metrics, confusion matrices, feature importance, clustering distributions, and regression performance.
- **Trip Management & Accounts:** JWT-based authentication, saved trips, favourites, customizable itineraries, and custom image uploads.

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic, SQLAlchemy, SQLite / MySQL |
| **Machine Learning** | scikit-learn, pandas, NumPy, joblib, Matplotlib, Seaborn |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Radix UI, Recharts, Framer Motion, React Router, Axios |

---

## Project Structure

```text
VoyageGo/
├── backend/
│   ├── app/
│   │   ├── api/            # FastAPI REST endpoints
│   │   ├── database/       # SQLAlchemy database configuration
│   │   ├── ml/             # Preprocessing, classification, clustering, regression, recommendation, constraint checker & train script
│   │   ├── models/         # ORM database models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── services/       # ML orchestration, auth, data, weather, travel catalog
│   │   └── main.py         # FastAPI application entrypoint
│   ├── datasets/           # Destination, place, user, interaction, and past-trip CSVs + dataset builders
│   ├── saved_models/       # Generated trained model artifacts (ignored in git; created by train.py)
│   ├── uploads/            # Runtime backend upload storage
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── uploads/        # Curated destination & place images
│   ├── src/
│   │   ├── components/     # Auth modal, navbar, footer, UI components
│   │   ├── context/        # Authentication context
│   │   ├── pages/          # Home, Destinations, Planner, Trip Result, My Trips, ML Dashboard, About
│   │   └── services/       # Typed Axios API client
│   ├── package.json
│   └── vite.config.ts
├── START_PROJECT.bat       # Windows one-click launcher (Backend + Frontend)
├── STOP_PROJECT.bat        # Windows server stop script
└── .gitignore
```

---

## Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**

### 1. Clone the Repository

```bash
git clone https://github.com/karmanyima08/VoyageGo.git
cd VoyageGo
```

### 2. Backend Setup & ML Model Training

```bash
cd backend
python -m venv .venv

# Activate virtual environment:
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS / Linux:
# source .venv/bin/activate

pip install -r requirements.txt

# Train and save the ML models to backend/saved_models/
python -m app.ml.train
```

Start the FastAPI server:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- API Base URL: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/docs`

### 3. Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

- Web App URL: `http://localhost:5173`

### Windows One-Click Launch (Optional)

Once Python dependencies are installed, models are trained (`python -m app.ml.train`), and `npm install` has been run in `frontend/`:

- Double-click **`START_PROJECT.bat`** to start both servers and open the app automatically.
- Run **`STOP_PROJECT.bat`** (or press any key in the launcher window) to stop both servers.

---

## Configuration

By default, the backend uses a local SQLite database (`backend/trip_planner.db`, created automatically on startup). To connect to MySQL or PostgreSQL instead, set the `DATABASE_URL` environment variable before starting the backend:

```bash
export DATABASE_URL="mysql+pymysql://user:password@localhost:3306/trip_planner"
```
