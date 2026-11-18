"""
SQLAlchemy database setup supporting SQLite (default) and PostgreSQL migration.
"""

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DB_DIR = Path(__file__).parent.parent.parent

# Supports MySQL (via MySQL Workbench / MySQL Server) or SQLite fallback:
# e.g., DATABASE_URL="mysql+pymysql://root:password@localhost:3306/trip_planner"
DEFAULT_SQLITE_URL = f"sqlite:///{DB_DIR}/trip_planner.db"
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=3600
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from app.models import db_models
    Base.metadata.create_all(bind=engine)
    print("[OK] Database initialized")
