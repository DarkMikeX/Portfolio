"""Main FastAPI application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import close_db
from app.core.logging_config import setup_logging
from app.routes import (
    personal_info,
    stats,
    services,
    projects,
    products,
    testimonials,
    skills,
    contact,
    status as status_route,
    nav_links,
    cart,
    checkout,
    dashboard,
    auth,
    bootstrap,
)

# Setup logging
logger = setup_logging()

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="A professional portfolio API"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(personal_info.router, prefix=settings.API_V1_PREFIX)
app.include_router(stats.router, prefix=settings.API_V1_PREFIX)
app.include_router(services.router, prefix=settings.API_V1_PREFIX)
app.include_router(projects.router, prefix=settings.API_V1_PREFIX)
app.include_router(products.router, prefix=settings.API_V1_PREFIX)
app.include_router(testimonials.router, prefix=settings.API_V1_PREFIX)
app.include_router(skills.router, prefix=settings.API_V1_PREFIX)
app.include_router(contact.router, prefix=settings.API_V1_PREFIX)
app.include_router(status_route.router, prefix=settings.API_V1_PREFIX)
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(nav_links.router, prefix=settings.API_V1_PREFIX)
app.include_router(bootstrap.router, prefix=settings.API_V1_PREFIX)
app.include_router(cart.router, prefix=settings.API_V1_PREFIX)
app.include_router(checkout.router, prefix=settings.API_V1_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get(settings.API_V1_PREFIX)
async def api_root():
    """API root endpoint"""
    return {
        "message": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "endpoints": {
            "personal-info": f"{settings.API_V1_PREFIX}/personal-info",
            "stats": f"{settings.API_V1_PREFIX}/stats",
            "services": f"{settings.API_V1_PREFIX}/services",
            "projects": f"{settings.API_V1_PREFIX}/projects",
            "products": f"{settings.API_V1_PREFIX}/products",
            "testimonials": f"{settings.API_V1_PREFIX}/testimonials",
            "skills": f"{settings.API_V1_PREFIX}/skills",
            "contact": f"{settings.API_V1_PREFIX}/contact",
            "status": f"{settings.API_V1_PREFIX}/status",
            "nav-links": f"{settings.API_V1_PREFIX}/nav-links",
            "cart": f"{settings.API_V1_PREFIX}/cart",
            "checkout": f"{settings.API_V1_PREFIX}/checkout"
        }
    }


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    await close_db()
    logger.info("Application shutdown complete")
