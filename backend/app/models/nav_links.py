"""Navigation links models"""
from pydantic import BaseModel, Field, ConfigDict
import uuid


class NavLink(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    label: str
    href: str
    order: int = 0


class NavLinkCreate(BaseModel):
    label: str
    href: str
    order: int = 0
