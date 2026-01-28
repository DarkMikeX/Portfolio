"""Services models"""
from pydantic import BaseModel, Field, ConfigDict
import uuid


class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: str


class ServiceCreate(BaseModel):
    title: str
    description: str
    icon: str
