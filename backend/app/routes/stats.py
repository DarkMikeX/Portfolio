"""Stats routes"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.stats import Stat, StatCreate
from app.core.database import db
from app.core.logging_config import setup_logging

logger = setup_logging()
router = APIRouter(prefix="/stats", tags=["stats"])


def _get_default_stats():
    """Get default stats"""
    return [
        Stat(id="1", value="5+", label="Years Experience", order=0),
        Stat(id="2", value="120+", label="Projects Completed", order=1),
        Stat(id="3", value="50+", label="Happy Clients", order=2),
        Stat(id="4", value="99%", label="Success Rate", order=3),
    ]


@router.get("", response_model=List[Stat])
async def get_stats():
    """Get all stats"""
    try:
        stats = await db.stats.find({}, {"_id": 0}).sort("order", 1).to_list(100)
        return [Stat(**stat) for stat in stats] if stats else _get_default_stats()
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning default stats.")
        return _get_default_stats()


@router.post("", response_model=Stat)
async def create_stat(stat: StatCreate):
    """Create a stat"""
    try:
        stat_obj = Stat(**stat.model_dump())
        doc = stat_obj.model_dump()
        await db.stats.insert_one(doc)
        return stat_obj
    except Exception as e:
        logger.error(f"Error creating stat: {e}")
        raise HTTPException(status_code=500, detail=str(e))
