from fastapi import HTTPException, Cookie, Header
from typing import Optional
import httpx
from datetime import datetime, timedelta, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase


EMERGENT_SESSION_API = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"


async def exchange_session_id(session_id: str) -> dict:
    """Exchange session_id for user data from Emergent Auth API"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                EMERGENT_SESSION_API,
                headers={"X-Session-ID": session_id},
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=401, detail="Invalid session_id")


async def get_current_user(session_token: Optional[str] = Cookie(None), authorization: Optional[str] = Header(None)):
    """Get current user from session token (cookie or header)"""
    from server import db  # Import db from server
    
    token = session_token
    
    # Fallback to Authorization header if cookie not present
    if not token and authorization:
        if authorization.startswith("Bearer "):
            token = authorization.replace("Bearer ", "")
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find session in database
    session = await db.sessions.find_one({"session_token": token})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check if session expired
    if session["expires_at"] < datetime.now(timezone.utc):
        await db.sessions.delete_one({"session_token": token})
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user
    user = await db.users.find_one({"id": session["user_id"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


async def create_or_update_user(db: AsyncIOMotorDatabase, user_data: dict) -> dict:
    """Create new user or return existing user"""
    existing_user = await db.users.find_one({"email": user_data["email"]})
    
    if existing_user:
        return existing_user
    
    # Create new user
    from models import User
    new_user = User(
        email=user_data["email"],
        name=user_data["name"],
        picture=user_data.get("picture")
    )
    await db.users.insert_one(new_user.dict())
    return new_user.dict()


async def create_session(db: AsyncIOMotorDatabase, user_id: str, session_token: str) -> dict:
    """Create a new session in database"""
    from models import Session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    session = Session(
        session_token=session_token,
        user_id=user_id,
        expires_at=expires_at
    )
    await db.sessions.insert_one(session.dict())
    return session.dict()