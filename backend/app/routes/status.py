"""Status check routes"""
from fastapi import APIRouter
from typing import List
from app.models.status import StatusCheck, StatusCheckCreate
from app.core.database import db
from app.core.logging_config import setup_logging
from datetime import datetime

logger = setup_logging()
router = APIRouter(prefix="/status", tags=["status"])


@router.post("", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    """Create a status check"""
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    try:
        doc = status_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        _ = await db.status_checks.insert_one(doc)
    except Exception as e:
        logger.warning(f"MongoDB insert failed: {e}. Returning object without persistence.")
    
    return status_obj


@router.get("", response_model=List[StatusCheck])
async def get_status_checks():
    """Get all status checks"""
    try:
        status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
        for check in status_checks:
            if isinstance(check['timestamp'], str):
                check['timestamp'] = datetime.fromisoformat(check['timestamp'])
        return status_checks
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning empty list.")
        return []
