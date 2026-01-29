"""Personal info routes"""
from fastapi import APIRouter, HTTPException
from app.models.personal_info import PersonalInfo, PersonalInfoUpdate, Socials
from app.core.database import db
from app.core.logging_config import setup_logging
from datetime import datetime, timezone

logger = setup_logging()
router = APIRouter(prefix="/personal-info", tags=["personal-info"])


@router.get("", response_model=PersonalInfo)
async def get_personal_info():
    """Get personal information"""
    try:
        info = await db.personal_info.find_one({}, {"_id": 0})
        if not info:
            return _get_default_personal_info()
        return PersonalInfo(**info)
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning default personal info.")
        return _get_default_personal_info()


@router.put("", response_model=PersonalInfo)
async def update_personal_info(update: PersonalInfoUpdate):
    """Update personal information"""
    try:
        existing = await db.personal_info.find_one({}, {"_id": 0})
        if not existing:
            new_info = PersonalInfo(
                name=update.name or "Gaurav",
                nickname=update.nickname or "Gaurav",
                title=update.title or "Full-Stack Developer",
                tagline=update.tagline or "With great code comes great responsibility",
                description=update.description or "A passionate developer...",
                email=update.email or "mike@urmikexd.me",
                phone=update.phone or "+1 (555) 123-4567",
                location=update.location or "New York City, NY",
                avatar=update.avatar or "/hero-avatar.png",
                resume=update.resume or "#",
                socials=update.socials or Socials()
            )
            doc = new_info.model_dump()
            await db.personal_info.insert_one(doc)
            return new_info
        
        update_dict = update.model_dump(exclude_unset=True)
        if 'socials' in update_dict and update_dict['socials']:
            update_dict['socials'] = update_dict['socials'].model_dump() if hasattr(update_dict['socials'], 'model_dump') else update_dict['socials']
        
        await db.personal_info.update_one({}, {"$set": update_dict})
        updated = await db.personal_info.find_one({}, {"_id": 0})
        return PersonalInfo(**updated)
    except Exception as e:
        logger.error(f"Error updating personal info: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def _get_default_personal_info():
    """Get default personal info"""
    return PersonalInfo(
        name="Gaurav",
        nickname="Gaurav",
        title="Full-Stack Developer",
        tagline="With great code comes great responsibility",
        description="A passionate developer swinging through the digital landscape, crafting exceptional web experiences with precision and creativity.",
        email="mike@urmikexd.me",
        phone="+1 (555) 123-4567",
        location="New York City, NY",
        avatar="/hero-avatar.png",
        resume="#",
        socials=Socials(
            github="https://github.com",
            linkedin="https://linkedin.com",
            twitter="https://twitter.com",
            dribbble="https://dribbble.com"
        )
    )
