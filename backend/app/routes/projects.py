"""Projects routes"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.projects import Project, ProjectCreate
from app.core.database import db
from app.core.logging_config import setup_logging

logger = setup_logging()
router = APIRouter(prefix="/projects", tags=["projects"])


def _get_default_projects():
    """Get default projects"""
    return [
        Project(id="1", title="E-Commerce Platform", description="A full-featured online store with payment integration and inventory management.", image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop", category="Web Development", technologies=["React", "Node.js", "MongoDB", "Stripe"], link="#", github="#"),
        Project(id="2", title="Task Management App", description="A collaborative project management tool with real-time updates and team features.", image="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop", category="Software Engineering", technologies=["Next.js", "TypeScript", "PostgreSQL", "Socket.io"], link="#", github="#"),
        Project(id="3", title="Finance Dashboard", description="Interactive analytics dashboard with data visualization and reporting features.", image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop", category="UI/UX Design", technologies=["React", "D3.js", "TailwindCSS", "Chart.js"], link="#", github="#"),
        Project(id="4", title="AI Chat Application", description="Intelligent conversational interface powered by machine learning algorithms.", image="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop", category="Software Engineering", technologies=["Python", "FastAPI", "OpenAI", "Redis"], link="#", github="#"),
        Project(id="5", title="Social Media App", description="Feature-rich social platform with real-time messaging and content sharing.", image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop", category="Web Development", technologies=["React Native", "Firebase", "GraphQL", "AWS"], link="#", github="#"),
        Project(id="6", title="Portfolio Generator", description="Dynamic portfolio builder with customizable templates and themes.", image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop", category="Freelancing", technologies=["Vue.js", "Nuxt", "Prisma", "Vercel"], link="#", github="#"),
    ]


@router.get("", response_model=List[Project])
async def get_projects():
    """Get all projects"""
    try:
        projects = await db.projects.find({}, {"_id": 0}).to_list(100)
        return [Project(**project) for project in projects] if projects else _get_default_projects()
    except Exception as e:
        logger.warning(f"MongoDB query failed: {e}. Returning default projects.")
        return _get_default_projects()


@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str):
    """Get a specific project"""
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


@router.post("", response_model=Project)
async def create_project(project: ProjectCreate):
    """Create a project"""
    try:
        project_obj = Project(**project.model_dump())
        doc = project_obj.model_dump()
        await db.projects.insert_one(doc)
        return project_obj
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{project_id}")
async def delete_project(project_id: str):
    """Delete a project"""
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
