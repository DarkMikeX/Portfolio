"""Contact routes"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.contact import ContactMessage, ContactMessageCreate
from app.core.database import db
from app.core.logging_config import setup_logging
from datetime import datetime

logger = setup_logging()
router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=ContactMessage)
async def create_contact_message(message: ContactMessageCreate):
    """Create a contact message"""
    try:
        message_obj = ContactMessage(**message.model_dump())
        doc = message_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.contact_messages.insert_one(doc)
        logger.info(f"New contact message from {message.email}")
        return message_obj
    except Exception as e:
        logger.error(f"Error creating contact message: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=List[ContactMessage])
async def get_contact_messages():
    """Get all contact messages"""
    try:
        messages = await db.contact_messages.find({}, {"_id": 0}).sort("timestamp", -1).to_list(100)
        for msg in messages:
            if isinstance(msg.get('timestamp'), str):
                msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
        return [ContactMessage(**msg) for msg in messages] if messages else []
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning empty list.")
        return []
