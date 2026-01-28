"""Skills models"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
import uuid


class Skill(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    level: int = Field(ge=0, le=100)


class SkillCreate(BaseModel):
    name: str
    level: int = Field(ge=0, le=100)
