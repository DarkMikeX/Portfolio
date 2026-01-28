"""Products models"""
from pydantic import BaseModel, Field, ConfigDict
import uuid


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    price: float
    originalPrice: float
    image: str
    category: str
    rating: float
    downloads: int


class ProductCreate(BaseModel):
    title: str
    description: str
    price: float
    originalPrice: float
    image: str
    category: str
    rating: float
    downloads: int
