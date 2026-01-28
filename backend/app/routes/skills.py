"""Skills routes"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.skills import Skill, SkillCreate
from app.core.database import db
from app.core.logging_config import setup_logging

logger = setup_logging()
router = APIRouter(prefix="/skills", tags=["skills"])


def _get_default_skills():
    """Get default skills"""
    return [
        Skill(id="1", name="React / Next.js", level=95),
        Skill(id="2", name="Node.js / Express", level=90),
        Skill(id="3", name="TypeScript", level=88),
        Skill(id="4", name="Python / FastAPI", level=85),
        Skill(id="5", name="MongoDB / PostgreSQL", level=87),
        Skill(id="6", name="UI/UX Design", level=82),
    ]


@router.get("", response_model=List[Skill])
async def get_skills():
    """Get all skills"""
    try:
        skills = await db.skills.find({}, {"_id": 0}).to_list(100)
        return [Skill(**skill) for skill in skills] if skills else _get_default_skills()
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning default skills.")
        return _get_default_skills()


@router.post("", response_model=Skill)
async def create_skill(skill: SkillCreate):
    """Create a skill"""
    try:
        skill_obj = Skill(**skill.model_dump())
        doc = skill_obj.model_dump()
        await db.skills.insert_one(doc)
        return skill_obj
    except Exception as e:
        logger.error(f"Error creating skill: {e}")
        raise HTTPException(status_code=500, detail=str(e))
