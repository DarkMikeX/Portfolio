"""Application configuration"""
import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent.parent
load_dotenv(ROOT_DIR / '.env')


class Settings:
    """Application settings"""
    
    # MongoDB Settings
    MONGO_URL: str = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    DB_NAME: str = os.environ.get('DB_NAME', 'portfolio_db')
    
    # CORS Settings
    CORS_ORIGINS: list = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # API Settings
    API_V1_PREFIX: str = "/api"
    PROJECT_NAME: str = "Portfolio API"
    VERSION: str = "1.0.0"
    
    # Server Settings
    SERVER_HOST: str = os.environ.get('SERVER_HOST', '127.0.0.1')
    SERVER_PORT: int = int(os.environ.get('SERVER_PORT', '8000'))
    
    # Stripe Settings
    STRIPE_SECRET_KEY: str = os.environ.get('STRIPE_SECRET_KEY', '')
    STRIPE_PUBLISHABLE_KEY: str = os.environ.get('STRIPE_PUBLISHABLE_KEY', '')
    STRIPE_WEBHOOK_SECRET: str = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
    
    # PayPal Settings
    PAYPAL_CLIENT_ID: str = os.environ.get('PAYPAL_CLIENT_ID', '')
    PAYPAL_CLIENT_SECRET: str = os.environ.get('PAYPAL_CLIENT_SECRET', '')
    PAYPAL_MODE: str = os.environ.get('PAYPAL_MODE', 'sandbox')  # sandbox or live
    
    # Razorpay Settings
    RAZORPAY_KEY_ID: str = os.environ.get('RAZORPAY_KEY_ID', '')
    RAZORPAY_KEY_SECRET: str = os.environ.get('RAZORPAY_KEY_SECRET', '')
    
    FRONTEND_URL: str = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    
    # Admin (dashboard access)
    ADMIN_USERNAME: str = os.environ.get('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD: str = os.environ.get('ADMIN_PASSWORD', 'admin123')
    JWT_SECRET: str = os.environ.get('JWT_SECRET', 'change-me-in-production-use-long-secret')
    JWT_ALGORITHM: str = os.environ.get('JWT_ALGORITHM', 'HS256')
    JWT_EXPIRE_HOURS: int = int(os.environ.get('JWT_EXPIRE_HOURS', '24'))


settings = Settings()
