"""Stats models"""
from pydantic import BaseModel, Field, ConfigDict
import uuid


class Stat(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    value: str
    label: str
    order: int = 0


class StatCreate(BaseModel):
    value: str
    label: str
    order: int = 0
