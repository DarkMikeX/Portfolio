"""Bootstrap endpoint - returns all home-page data in one request for fast load"""
import asyncio
import logging
from fastapi import APIRouter, Response

from app.core.database import db
from app.routes.personal_info import _get_default_personal_info
from app.routes.stats import _get_default_stats
from app.routes.services import _get_default_services
from app.routes.projects import _get_default_projects
from app.routes.products import _get_default_products
from app.routes.testimonials import _get_default_testimonials
from app.routes.skills import _get_default_skills

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/bootstrap", tags=["bootstrap"])

_DEFAULT_NAV_LINKS = [
    {"id": "1", "label": "Home", "href": "#home", "order": 0},
    {"id": "2", "label": "Services", "href": "#services", "order": 1},
    {"id": "3", "label": "Portfolio", "href": "#portfolio", "order": 2},
    {"id": "4", "label": "Products", "href": "#products", "order": 3},
    {"id": "5", "label": "Testimonials", "href": "#testimonials", "order": 4},
    {"id": "6", "label": "Contact", "href": "#contact", "order": 5},
]


async def _fetch_personal_info():
    try:
        info = await db.personal_info.find_one({}, {"_id": 0})
        if info:
            return info
    except Exception as e:
        logger.warning(f"Bootstrap personal_info: {e}")
    return _get_default_personal_info().model_dump()


async def _fetch_stats():
    try:
        rows = await db.stats.find({}, {"_id": 0}).sort("order", 1).to_list(100)
        if rows:
            return [r for r in rows]
    except Exception as e:
        logger.warning(f"Bootstrap stats: {e}")
    return [s.model_dump() for s in _get_default_stats()]


async def _fetch_nav_links():
    try:
        rows = await db.nav_links.find({}, {"_id": 0}).sort("order", 1).to_list(100)
        if rows:
            return rows
    except Exception as e:
        logger.warning(f"Bootstrap nav_links: {e}")
    return _DEFAULT_NAV_LINKS


async def _fetch_services():
    try:
        rows = await db.services.find({}, {"_id": 0}).to_list(100)
        if rows:
            return rows
    except Exception as e:
        logger.warning(f"Bootstrap services: {e}")
    return [s.model_dump() for s in _get_default_services()]


async def _fetch_projects():
    try:
        rows = await db.projects.find({}, {"_id": 0}).to_list(100)
        if rows:
            return rows
    except Exception as e:
        logger.warning(f"Bootstrap projects: {e}")
    return [p.model_dump() for p in _get_default_projects()]


async def _fetch_products():
    try:
        rows = await db.products.find({}, {"_id": 0}).to_list(100)
        if rows:
            return rows
    except Exception as e:
        logger.warning(f"Bootstrap products: {e}")
    return [p.model_dump() for p in _get_default_products()]


async def _fetch_testimonials():
    try:
        rows = await db.testimonials.find({}, {"_id": 0}).to_list(100)
        if rows:
            return rows
    except Exception as e:
        logger.warning(f"Bootstrap testimonials: {e}")
    return [t.model_dump() for t in _get_default_testimonials()]


async def _fetch_skills():
    try:
        rows = await db.skills.find({}, {"_id": 0}).to_list(100)
        if rows:
            return rows
    except Exception as e:
        logger.warning(f"Bootstrap skills: {e}")
    return [s.model_dump() for s in _get_default_skills()]


@router.get("")
async def get_bootstrap(response: Response):
    """Return all home-page data in one request. One round-trip, one DB wait."""
    response.headers["Cache-Control"] = "public, max-age=60"
    personal_info, stats, nav_links, services, projects, products, testimonials, skills = await asyncio.gather(
        _fetch_personal_info(),
        _fetch_stats(),
        _fetch_nav_links(),
        _fetch_services(),
        _fetch_projects(),
        _fetch_products(),
        _fetch_testimonials(),
        _fetch_skills(),
    )
    return {
        "personalInfo": personal_info,
        "stats": stats,
        "navLinks": nav_links,
        "services": services,
        "projects": projects,
        "products": products,
        "testimonials": testimonials,
        "skills": skills,
    }
