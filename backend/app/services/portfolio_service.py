"""
Portfolio Service
Business logic for portfolio operations
"""
from typing import List, Optional
from app.core.database import db
from app.core.logging_config import setup_logging

logger = setup_logging()


class PortfolioService:
    """Service class for portfolio-related operations"""
    
    @staticmethod
    async def get_all_projects(category: Optional[str] = None) -> List[dict]:
        """Get all projects, optionally filtered by category"""
        try:
            query = {} if not category or category == "All" else {"category": category}
            projects = await db.projects.find(query, {"_id": 0}).to_list(100)
            return projects if projects else []
        except Exception as e:
            logger.error(f"Error fetching projects: {e}")
            return []
    
    @staticmethod
    async def get_project_categories() -> List[str]:
        """Get all unique project categories"""
        try:
            categories = await db.projects.distinct("category")
            return categories if categories else []
        except Exception as e:
            logger.error(f"Error fetching categories: {e}")
            return []
    
    @staticmethod
    async def get_project_by_id(project_id: str) -> Optional[dict]:
        """Get a specific project by ID"""
        try:
            project = await db.projects.find_one({"id": project_id}, {"_id": 0})
            return project
        except Exception as e:
            logger.error(f"Error fetching project: {e}")
            return None
