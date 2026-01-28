"""Projects models"""
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid


class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image: str
    category: str
    technologies: List[str]
    link: Optional[str] = ""
    github: Optional[str] = ""


class ProjectCreate(BaseModel):
    title: str
    description: str
    image: str
    category: str
    technologies: List[str]
    link: Optional[str] = ""
    github: Optional[str] = ""
