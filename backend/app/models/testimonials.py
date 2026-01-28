"""Testimonials models"""
from pydantic import BaseModel, Field, ConfigDict
import uuid


class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    avatar: str
    content: str
    rating: int = Field(ge=1, le=5)


class TestimonialCreate(BaseModel):
    name: str
    role: str
    avatar: str
    content: str
    rating: int = Field(ge=1, le=5)
