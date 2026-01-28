"""Database connection and utilities"""
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# MongoDB client - short timeout so we fail fast when DB is down and return defaults quickly
client = AsyncIOMotorClient(settings.MONGO_URL, serverSelectionTimeoutMS=1500)
db = client[settings.DB_NAME]


async def close_db():
    """Close database connection"""
    client.close()
    logger.info("Database connection closed")
