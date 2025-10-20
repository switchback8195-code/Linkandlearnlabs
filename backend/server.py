from fastapi import FastAPI, APIRouter, HTTPException, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone
from bson import ObjectId

from models import (
    User, Session, SessionCreate, LearningPath, Build, BuildCreate,
    Event, ForumTopic, ForumTopicCreate, ForumReply, AffiliateTool, Video
)
from auth import exchange_session_id, get_current_user, create_or_update_user, create_session
from seed_data import learning_paths_data, events_data, affiliate_tools_data, videos_data


# Custom JSON encoder for MongoDB ObjectId
class MongoJSONEncoder:
    @staticmethod
    def convert_objectid(obj):
        """Convert MongoDB documents with ObjectId to JSON-serializable format"""
        if isinstance(obj, list):
            return [MongoJSONEncoder.convert_objectid(item) for item in obj]
        elif isinstance(obj, dict):
            return {key: MongoJSONEncoder.convert_objectid(value) for key, value in obj.items()}
        elif isinstance(obj, ObjectId):
            return str(obj)
        return obj


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ===== Startup Event - Seed Data =====
@app.on_event("startup")
async def startup_seed_data():
    """Seed initial data if collections are empty"""
    # Seed learning paths
    if await db.learning_paths.count_documents({}) == 0:
        await db.learning_paths.insert_many(learning_paths_data)
        logging.info("Seeded learning paths")
    
    # Seed events
    if await db.events.count_documents({}) == 0:
        await db.events.insert_many(events_data)
        logging.info("Seeded events")
    
    # Seed affiliate tools
    if await db.affiliate_tools.count_documents({}) == 0:
        await db.affiliate_tools.insert_many(affiliate_tools_data)
        logging.info("Seeded affiliate tools")
    
    # Seed videos
    if await db.videos.count_documents({}) == 0:
        await db.videos.insert_many(videos_data)
        logging.info("Seeded videos")


# ===== Authentication Routes =====
@api_router.post("/auth/session")
async def create_auth_session(session_data: SessionCreate, response: Response):
    """Exchange session_id for user data and create session"""
    try:
        # Get user data from Emergent Auth
        emergent_data = await exchange_session_id(session_data.session_id)
        
        # Create or get existing user
        user = await create_or_update_user(db, emergent_data)
        
        # Create session
        session = await create_session(db, user["id"], emergent_data["session_token"])
        
        # Set httpOnly cookie
        response.set_cookie(
            key="session_token",
            value=emergent_data["session_token"],
            httponly=True,
            secure=True,
            samesite="none",
            max_age=7 * 24 * 60 * 60,  # 7 days
            path="/"
        )
        
        return {"user": user, "session_token": emergent_data["session_token"]}
    
    except Exception as e:
        logging.error(f"Session creation error: {str(e)}")
        raise HTTPException(status_code=401, detail=str(e))


@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user"""
    return current_user


@api_router.post("/auth/logout")
async def logout(response: Response, current_user: dict = Depends(get_current_user)):
    """Logout user and clear session"""
    # Delete session from database
    await db.sessions.delete_many({"user_id": current_user["id"]})
    
    # Clear cookie
    response.delete_cookie(key="session_token", path="/")
    
    return {"success": True}


# ===== Learning Paths Routes =====
@api_router.get("/learning-paths", response_model=List[LearningPath])
async def get_learning_paths():
    """Get all learning paths"""
    paths = await db.learning_paths.find().to_list(1000)
    paths = MongoJSONEncoder.convert_objectid(paths)
    return paths


@api_router.get("/learning-paths/{path_id}")
async def get_learning_path(path_id: str):
    """Get single learning path"""
    path = await db.learning_paths.find_one({"id": path_id})
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")
    return MongoJSONEncoder.convert_objectid(path)


@api_router.post("/learning-paths/{path_id}/enroll")
async def enroll_learning_path(path_id: str, current_user: dict = Depends(get_current_user)):
    """Enroll in a learning path"""
    path = await db.learning_paths.find_one({"id": path_id})
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")
    
    # Increment enrolled count
    await db.learning_paths.update_one(
        {"id": path_id},
        {"$inc": {"enrolled": 1}}
    )
    
    updated_path = await db.learning_paths.find_one({"id": path_id})
    return updated_path


# ===== Builds Routes =====
@api_router.get("/builds", response_model=List[Build])
async def get_builds(limit: int = 10, offset: int = 0):
    """Get featured builds"""
    builds = await db.builds.find().sort("date", -1).skip(offset).limit(limit).to_list(limit)
    return MongoJSONEncoder.convert_objectid(builds)


@api_router.post("/builds", response_model=Build)
async def create_build(build_data: BuildCreate, current_user: dict = Depends(get_current_user)):
    """Create a new build"""
    build = Build(
        title=build_data.title,
        builder=current_user["name"],
        builder_id=current_user["id"],
        image=build_data.image,
        specs=build_data.specs
    )
    
    await db.builds.insert_one(build.dict())
    
    # Increment user's buildsShared count
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$inc": {"buildsShared": 1}}
    )
    
    return build


@api_router.post("/builds/{build_id}/like")
async def like_build(build_id: str, current_user: dict = Depends(get_current_user)):
    """Like a build"""
    build = await db.builds.find_one({"id": build_id})
    if not build:
        raise HTTPException(status_code=404, detail="Build not found")
    
    await db.builds.update_one(
        {"id": build_id},
        {"$inc": {"likes": 1}}
    )
    
    updated_build = await db.builds.find_one({"id": build_id})
    return updated_build


# ===== Events Routes =====
@api_router.get("/events", response_model=List[Event])
async def get_events(upcoming: bool = True):
    """Get events"""
    events = await db.events.find().to_list(1000)
    return events


@api_router.post("/events/{event_id}/register")
async def register_event(event_id: str, current_user: dict = Depends(get_current_user)):
    """Register for an event"""
    event = await db.events.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if already registered
    if current_user["id"] in event.get("registered_users", []):
        raise HTTPException(status_code=400, detail="Already registered")
    
    # Check if event is full
    if event["attendees"] >= event["maxAttendees"]:
        raise HTTPException(status_code=400, detail="Event is full")
    
    # Register user
    await db.events.update_one(
        {"id": event_id},
        {
            "$inc": {"attendees": 1},
            "$push": {"registered_users": current_user["id"]}
        }
    )
    
    updated_event = await db.events.find_one({"id": event_id})
    return updated_event


# ===== Forum Routes =====
@api_router.get("/forum/topics", response_model=List[ForumTopic])
async def get_forum_topics(category: Optional[str] = None, limit: int = 20, offset: int = 0):
    """Get forum topics"""
    query = {}
    if category:
        query["category"] = category
    
    topics = await db.forum_topics.find(query).sort("lastActivity", -1).skip(offset).limit(limit).to_list(limit)
    return topics


@api_router.post("/forum/topics", response_model=ForumTopic)
async def create_forum_topic(topic_data: ForumTopicCreate, current_user: dict = Depends(get_current_user)):
    """Create a new forum topic"""
    topic = ForumTopic(
        title=topic_data.title,
        author=current_user["name"],
        author_id=current_user["id"],
        category=topic_data.category
    )
    
    await db.forum_topics.insert_one(topic.dict())
    return topic


@api_router.post("/forum/topics/{topic_id}/reply")
async def reply_forum_topic(topic_id: str, content: str, current_user: dict = Depends(get_current_user)):
    """Reply to a forum topic"""
    topic = await db.forum_topics.find_one({"id": topic_id})
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    reply = ForumReply(
        topic_id=topic_id,
        author=current_user["name"],
        author_id=current_user["id"],
        content=content
    )
    
    await db.forum_replies.insert_one(reply.dict())
    
    # Update topic reply count and last activity
    await db.forum_topics.update_one(
        {"id": topic_id},
        {
            "$inc": {"replies": 1},
            "$set": {"lastActivity": datetime.now(timezone.utc)}
        }
    )
    
    return reply


# ===== Affiliate Tools Routes =====
@api_router.get("/affiliate-tools", response_model=List[AffiliateTool])
async def get_affiliate_tools():
    """Get all affiliate tools"""
    tools = await db.affiliate_tools.find().sort("featured", -1).to_list(1000)
    return tools


@api_router.post("/affiliate-tools", response_model=AffiliateTool)
async def create_affiliate_tool(tool_data: AffiliateTool, current_user: dict = Depends(get_current_user)):
    """Create a new affiliate tool"""
    await db.affiliate_tools.insert_one(tool_data.dict())
    return tool_data


@api_router.put("/affiliate-tools/{tool_id}", response_model=AffiliateTool)
async def update_affiliate_tool(tool_id: str, tool_data: AffiliateTool, current_user: dict = Depends(get_current_user)):
    """Update an affiliate tool"""
    tool = await db.affiliate_tools.find_one({"id": tool_id})
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    await db.affiliate_tools.update_one(
        {"id": tool_id},
        {"$set": tool_data.dict()}
    )
    return tool_data


@api_router.delete("/affiliate-tools/{tool_id}")
async def delete_affiliate_tool(tool_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an affiliate tool"""
    result = await db.affiliate_tools.delete_one({"id": tool_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tool not found")
    return {"success": True}


# ===== Videos Routes =====
@api_router.get("/videos", response_model=List[Video])
async def get_videos():
    """Get all video tutorials"""
    videos = await db.videos.find().sort("created_at", -1).to_list(1000)
    return videos


@api_router.post("/videos", response_model=Video)
async def create_video(video_data: Video, current_user: dict = Depends(get_current_user)):
    """Create a new video"""
    await db.videos.insert_one(video_data.dict())
    return video_data


@api_router.put("/videos/{video_id}", response_model=Video)
async def update_video(video_id: str, video_data: Video, current_user: dict = Depends(get_current_user)):
    """Update a video"""
    video = await db.videos.find_one({"id": video_id})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    await db.videos.update_one(
        {"id": video_id},
        {"$set": video_data.dict()}
    )
    return video_data


@api_router.delete("/videos/{video_id}")
async def delete_video(video_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a video"""
    result = await db.videos.delete_one({"id": video_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"success": True}


# ===== Test Route =====
@api_router.get("/")
async def root():
    return {"message": "LinkAndLearnLabs API is running"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()