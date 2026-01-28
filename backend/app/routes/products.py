"""Products routes"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.products import Product, ProductCreate
from app.core.database import db
from app.core.logging_config import setup_logging

logger = setup_logging()
router = APIRouter(prefix="/products", tags=["products"])


def _get_default_products():
    """Get default products"""
    return [
        Product(id="1", title="React Component Library", description="50+ customizable UI components for rapid development.", price=49, originalPrice=79, image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop", category="Code", rating=4.9, downloads=2500),
        Product(id="2", title="Full-Stack Starter Kit", description="Production-ready boilerplate with auth, API, and database.", price=79, originalPrice=129, image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop", category="Template", rating=4.8, downloads=1800),
        Product(id="3", title="Developer Icons Pack", description="500+ premium icons optimized for web and mobile.", price=29, originalPrice=49, image="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop", category="Design", rating=4.7, downloads=3200),
        Product(id="4", title="API Integration Guide", description="Comprehensive e-book on building robust API integrations.", price=19, originalPrice=39, image="https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop", category="E-Book", rating=4.9, downloads=4100),
    ]


@router.get("", response_model=List[Product])
async def get_products():
    """Get all products"""
    try:
        products = await db.products.find({}, {"_id": 0}).to_list(100)
        return [Product(**product) for product in products] if products else _get_default_products()
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning default products.")
        return _get_default_products()


@router.post("", response_model=Product)
async def create_product(product: ProductCreate):
    """Create a product"""
    try:
        product_obj = Product(**product.model_dump())
        doc = product_obj.model_dump()
        await db.products.insert_one(doc)
        return product_obj
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """Delete a product"""
    try:
        result = await db.products.delete_one({"id": product_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product: {e}")
        raise HTTPException(status_code=500, detail=str(e))
