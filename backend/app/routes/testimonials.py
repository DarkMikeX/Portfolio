"""Testimonials routes"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.testimonials import Testimonial, TestimonialCreate
from app.core.database import db
from app.core.logging_config import setup_logging

logger = setup_logging()
router = APIRouter(prefix="/testimonials", tags=["testimonials"])


def _get_default_testimonials():
    """Get default testimonials"""
    return [
        Testimonial(id="1", name="Sarah Johnson", role="CEO, TechStart Inc.", avatar="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face", content="Gaurav delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise are unmatched.", rating=5),
        Testimonial(id="2", name="David Chen", role="Product Manager, InnovateCo", avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", content="Working with Gaurav was a game-changer for our project. He brought creative solutions and delivered ahead of schedule.", rating=5),
        Testimonial(id="3", name="Emily Rodriguez", role="Founder, DesignLab", avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", content="The UI/UX work Gaurav did for our app transformed our user engagement. Highly recommend his services!", rating=5),
        Testimonial(id="4", name="Marcus Thompson", role="CTO, DataFlow Systems", avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", content="Gaurav's software engineering skills are top-notch. He built us a scalable solution that handles millions of requests.", rating=5),
    ]


@router.get("", response_model=List[Testimonial])
async def get_testimonials():
    """Get all testimonials"""
    try:
        testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(100)
        return [Testimonial(**testimonial) for testimonial in testimonials] if testimonials else _get_default_testimonials()
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning default testimonials.")
        return _get_default_testimonials()


@router.post("", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate):
    """Create a testimonial"""
    try:
        testimonial_obj = Testimonial(**testimonial.model_dump())
        doc = testimonial_obj.model_dump()
        await db.testimonials.insert_one(doc)
        return testimonial_obj
    except Exception as e:
        logger.error(f"Error creating testimonial: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    """Delete a testimonial"""
    try:
        result = await db.testimonials.delete_one({"id": testimonial_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        return {"message": "Testimonial deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting testimonial: {e}")
        raise HTTPException(status_code=500, detail=str(e))
