"""Navigation links routes"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.nav_links import NavLink, NavLinkCreate
from app.core.database import db
from app.core.logging_config import setup_logging

logger = setup_logging()
router = APIRouter(prefix="/nav-links", tags=["nav-links"])


@router.get("", response_model=List[NavLink])
async def get_nav_links():
    """Get all navigation links"""
    try:
        nav_links = await db.nav_links.find({}, {"_id": 0}).sort("order", 1).to_list(100)
        return [NavLink(**link) for link in nav_links] if nav_links else []
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning default nav links.")
        # Return default nav links
        return [
            NavLink(id="1", label="Home", href="#home", order=0),
            NavLink(id="2", label="Services", href="#services", order=1),
            NavLink(id="3", label="Portfolio", href="#portfolio", order=2),
            NavLink(id="4", label="Products", href="#products", order=3),
            NavLink(id="5", label="Testimonials", href="#testimonials", order=4),
            NavLink(id="6", label="Contact", href="#contact", order=5),
        ]


@router.post("", response_model=NavLink)
async def create_nav_link(nav_link: NavLinkCreate):
    """Create a navigation link"""
    try:
        nav_link_obj = NavLink(**nav_link.model_dump())
        doc = nav_link_obj.model_dump()
        await db.nav_links.insert_one(doc)
        return nav_link_obj
    except Exception as e:
        logger.error(f"Error creating nav link: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{nav_link_id}")
async def delete_nav_link(nav_link_id: str):
    """Delete a navigation link"""
    try:
        result = await db.nav_links.delete_one({"id": nav_link_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Nav link not found")
        return {"message": "Nav link deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting nav link: {e}")
        raise HTTPException(status_code=500, detail=str(e))
