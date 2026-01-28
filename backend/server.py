from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'portfolio_db')
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
db = client[db_name]

# Create the main app without a prefix
app = FastAPI(title="Portfolio API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== MODELS ====================

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Personal Info Models
class Socials(BaseModel):
    github: Optional[str] = ""
    linkedin: Optional[str] = ""
    twitter: Optional[str] = ""
    dribbble: Optional[str] = ""

class PersonalInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    nickname: str
    title: str
    tagline: str
    description: str
    email: EmailStr
    phone: str
    location: str
    avatar: str
    resume: Optional[str] = ""
    socials: Socials

class PersonalInfoUpdate(BaseModel):
    name: Optional[str] = None
    nickname: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    avatar: Optional[str] = None
    resume: Optional[str] = None
    socials: Optional[Socials] = None

# Stats Model
class Stat(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    value: str
    label: str
    order: int = 0

class StatCreate(BaseModel):
    value: str
    label: str
    order: int = 0

# Services Model
class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: str

class ServiceCreate(BaseModel):
    title: str
    description: str
    icon: str

# Projects Model
class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image: str
    category: str
    technologies: List[str]
    link: Optional[str] = ""
    github: Optional[str] = ""

class ProjectCreate(BaseModel):
    title: str
    description: str
    image: str
    category: str
    technologies: List[str]
    link: Optional[str] = ""
    github: Optional[str] = ""

# Products Model
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

# Testimonials Model
class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    avatar: str
    content: str
    rating: int = Field(ge=1, le=5)

class TestimonialCreate(BaseModel):
    name: str
    role: str
    avatar: str
    content: str
    rating: int = Field(ge=1, le=5)

# Skills Model
class Skill(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    level: int = Field(ge=0, le=100)

class SkillCreate(BaseModel):
    name: str
    level: int = Field(ge=0, le=100)

# Contact Model
class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read: bool = False

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Portfolio API", "version": "1.0.0"}

# Status Check Routes
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    try:
        doc = status_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        _ = await db.status_checks.insert_one(doc)
    except Exception as e:
        logger.warning(f"MongoDB insert failed: {e}. Returning object without persistence.")
    
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    try:
        status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
        for check in status_checks:
            if isinstance(check['timestamp'], str):
                check['timestamp'] = datetime.fromisoformat(check['timestamp'])
        return status_checks
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning empty list.")
        return []

# Personal Info Routes
@api_router.get("/personal-info", response_model=PersonalInfo)
async def get_personal_info():
    try:
        info = await db.personal_info.find_one({}, {"_id": 0})
        if not info:
            # Return default if not found
            default_info = PersonalInfo(
                name="Michael Parker",
                nickname="Mikey",
                title="Full-Stack Developer",
                tagline="With great code comes great responsibility",
                description="A passionate developer swinging through the digital landscape, crafting exceptional web experiences with precision and creativity.",
                email="mikey@webdev.com",
                phone="+1 (555) 123-4567",
                location="New York City, NY",
                avatar="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
                resume="#",
                socials=Socials(
                    github="https://github.com",
                    linkedin="https://linkedin.com",
                    twitter="https://twitter.com",
                    dribbble="https://dribbble.com"
                )
            )
            return default_info
        return PersonalInfo(**info)
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning default personal info.")
        # Return default on error
        return PersonalInfo(
            name="Michael Parker",
            nickname="Mikey",
            title="Full-Stack Developer",
            tagline="With great code comes great responsibility",
            description="A passionate developer swinging through the digital landscape, crafting exceptional web experiences with precision and creativity.",
            email="mikey@webdev.com",
            phone="+1 (555) 123-4567",
            location="New York City, NY",
            avatar="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
            resume="#",
            socials=Socials(
                github="https://github.com",
                linkedin="https://linkedin.com",
                twitter="https://twitter.com",
                dribbble="https://dribbble.com"
            )
        )

@api_router.put("/personal-info", response_model=PersonalInfo)
async def update_personal_info(update: PersonalInfoUpdate):
    try:
        existing = await db.personal_info.find_one({}, {"_id": 0})
        if not existing:
            # Create new if doesn't exist
            new_info = PersonalInfo(
                name=update.name or "Michael Parker",
                nickname=update.nickname or "Mikey",
                title=update.title or "Full-Stack Developer",
                tagline=update.tagline or "With great code comes great responsibility",
                description=update.description or "A passionate developer...",
                email=update.email or "mikey@webdev.com",
                phone=update.phone or "+1 (555) 123-4567",
                location=update.location or "New York City, NY",
                avatar=update.avatar or "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
                resume=update.resume or "#",
                socials=update.socials or Socials()
            )
            doc = new_info.model_dump()
            doc['timestamp'] = doc.get('timestamp', datetime.now(timezone.utc)).isoformat()
            await db.personal_info.insert_one(doc)
            return new_info
        
        # Update existing
        update_dict = update.model_dump(exclude_unset=True)
        if 'socials' in update_dict and update_dict['socials']:
            update_dict['socials'] = update_dict['socials'].model_dump() if hasattr(update_dict['socials'], 'model_dump') else update_dict['socials']
        
        await db.personal_info.update_one({}, {"$set": update_dict})
        updated = await db.personal_info.find_one({}, {"_id": 0})
        return PersonalInfo(**updated)
    except Exception as e:
        logger.error(f"Error updating personal info: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Stats Routes
@api_router.get("/stats", response_model=List[Stat])
async def get_stats():
    try:
        stats = await db.stats.find({}, {"_id": 0}).sort("order", 1).to_list(100)
        return [Stat(**stat) for stat in stats] if stats else []
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning empty list.")
        return []

@api_router.post("/stats", response_model=Stat)
async def create_stat(stat: StatCreate):
    try:
        stat_obj = Stat(**stat.model_dump())
        doc = stat_obj.model_dump()
        await db.stats.insert_one(doc)
        return stat_obj
    except Exception as e:
        logger.error(f"Error creating stat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Services Routes
@api_router.get("/services", response_model=List[Service])
async def get_services():
    try:
        services = await db.services.find({}, {"_id": 0}).to_list(100)
        return [Service(**service) for service in services] if services else []
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning empty list.")
        return []

@api_router.post("/services", response_model=Service)
async def create_service(service: ServiceCreate):
    try:
        service_obj = Service(**service.model_dump())
        doc = service_obj.model_dump()
        await db.services.insert_one(doc)
        return service_obj
    except Exception as e:
        logger.error(f"Error creating service: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str):
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

# Projects Routes
@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    try:
        projects = await db.projects.find({}, {"_id": 0}).to_list(100)
        return [Project(**project) for project in projects] if projects else []
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning empty list.")
        return []

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    try:
        project = await db.projects.find_one({"id": project_id}, {"_id": 0})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return Project(**project)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    try:
        project_obj = Project(**project.model_dump())
        doc = project_obj.model_dump()
        await db.projects.insert_one(doc)
        return project_obj
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    try:
        result = await db.projects.delete_one({"id": project_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Products Routes
@api_router.get("/products", response_model=List[Product])
async def get_products():
    try:
        products = await db.products.find({}, {"_id": 0}).to_list(100)
        return [Product(**product) for product in products] if products else []
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning empty list.")
        return []

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    try:
        product_obj = Product(**product.model_dump())
        doc = product_obj.model_dump()
        await db.products.insert_one(doc)
        return product_obj
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
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

# Testimonials Routes
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    try:
        testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(100)
        return [Testimonial(**testimonial) for testimonial in testimonials] if testimonials else []
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning empty list.")
        return []

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate):
    try:
        testimonial_obj = Testimonial(**testimonial.model_dump())
        doc = testimonial_obj.model_dump()
        await db.testimonials.insert_one(doc)
        return testimonial_obj
    except Exception as e:
        logger.error(f"Error creating testimonial: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
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

# Skills Routes
@api_router.get("/skills", response_model=List[Skill])
async def get_skills():
    try:
        skills = await db.skills.find({}, {"_id": 0}).to_list(100)
        return [Skill(**skill) for skill in skills] if skills else []
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning empty list.")
        return []

@api_router.post("/skills", response_model=Skill)
async def create_skill(skill: SkillCreate):
    try:
        skill_obj = Skill(**skill.model_dump())
        doc = skill_obj.model_dump()
        await db.skills.insert_one(doc)
        return skill_obj
    except Exception as e:
        logger.error(f"Error creating skill: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Contact Routes
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(message: ContactMessageCreate):
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

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    try:
        messages = await db.contact_messages.find({}, {"_id": 0}).sort("timestamp", -1).to_list(100)
        for msg in messages:
            if isinstance(msg.get('timestamp'), str):
                msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
        return [ContactMessage(**msg) for msg in messages] if messages else []
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning empty list.")
        return []


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
