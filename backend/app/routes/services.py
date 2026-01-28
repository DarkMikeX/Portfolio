"""Services routes"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.services import Service, ServiceCreate
from app.core.database import db
from app.core.logging_config import setup_logging

logger = setup_logging()
router = APIRouter(prefix="/services", tags=["services"])


def _get_default_services():
    """Get default services"""
    return [
        Service(id="1", title="Web Development", description="Building responsive, high-performance websites with modern frameworks and best practices.", icon="Globe"),
        Service(id="2", title="Software Engineering", description="Designing scalable software solutions with clean architecture and efficient algorithms.", icon="Code2"),
        Service(id="3", title="UI/UX Design", description="Creating intuitive interfaces and seamless user experiences that captivate and convert.", icon="Palette"),
        Service(id="4", title="Freelancing", description="Delivering custom solutions tailored to your unique business needs and goals.", icon="Briefcase"),
    ]


@router.get("", response_model=List[Service])
async def get_services():
    """Get all services"""
    try:
        services = await db.services.find({}, {"_id": 0}).to_list(100)
        return [Service(**service) for service in services] if services else _get_default_services()
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning default services.")
        return _get_default_services()


@router.post("", response_model=Service)
async def create_service(service: ServiceCreate):
    """Create a service"""
    try:
        service_obj = Service(**service.model_dump())
        doc = service_obj.model_dump()
        await db.services.insert_one(doc)
        return service_obj
    except Exception as e:
        logger.error(f"Error creating service: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{service_id}")
async def delete_service(service_id: str):
    """Delete a service"""
    try:
        result = await db.services.delete_one({"id": service_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Service not found")
        return {"message": "Service deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting service: {e}")
        raise HTTPException(status_code=500, detail=str(e))
