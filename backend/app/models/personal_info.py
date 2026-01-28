"""Personal information models"""
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
import uuid


class Socials(BaseModel):
    github: Optional[str] = ""
    linkedin: Optional[str] = ""
    twitter: Optional[str] = ""
    dribbble: Optional[str] = ""


class PersonalInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    nickname: str
    title: str
    tagline: str
    description: str
    email: EmailStr
    phone: str
    location: str
    avatar: str
    resume: Optional[str] = ""
    socials: Socials


class PersonalInfoUpdate(BaseModel):
    name: Optional[str] = None
    nickname: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    avatar: Optional[str] = None
    resume: Optional[str] = None
    socials: Optional[Socials] = None
