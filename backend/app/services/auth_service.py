"""
Auth Service: Password hashing via PBKDF2-SHA256 and JWT Token generation/verification.
"""

from passlib.context import CryptContext
from jose import jwt
from typing import Optional, Dict, Any
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
JWT_SECRET = "voyageml_capstone_cse2032_jwt_secret_key_2026"
JWT_ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 30


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: int, email: str, name: str) -> str:
    expire = datetime.utcnow() + timedelta(days=TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": email,
        "user_id": user_id,
        "name": name,
        "exp": expire,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except Exception:
        return None
