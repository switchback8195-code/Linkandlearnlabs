from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid


class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    picture: Optional[str] = None
    joined: datetime = Field(default_factory=datetime.utcnow)
    buildsShared: int = 0
    coursesCompleted: int = 0
    communityRank: str = "Bronze"


class Session(BaseModel):
    session_token: str
    user_id: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)


class SessionCreate(BaseModel):
    session_id: str


class LearningPath(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    difficulty: str
    duration: str
    modules: int
    enrolled: int = 0


class Build(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    builder: str
    builder_id: str
    image: str
    specs: str
    likes: int = 0
    date: datetime = Field(default_factory=datetime.utcnow)


class BuildCreate(BaseModel):
    title: str
    image: str
    specs: str


class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    date: str
    time: str
    location: str
    image: str
    attendees: int = 0
    maxAttendees: int
    description: str
    registered_users: List[str] = []


class ForumTopic(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    author: str
    author_id: str
    category: str
    replies: int = 0
    views: int = 0
    lastActivity: datetime = Field(default_factory=datetime.utcnow)
    isPinned: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ForumTopicCreate(BaseModel):
    title: str
    category: str
    content: str


class ForumReply(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    topic_id: str
    author: str
    author_id: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)