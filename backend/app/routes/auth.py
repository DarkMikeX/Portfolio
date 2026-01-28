"""Admin auth routes"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.core.config import settings
from app.core.auth import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    admin: bool = True


@router.post("/login", response_model=LoginResponse)
async def admin_login(body: LoginRequest):
    """Admin login; returns JWT for dashboard access."""
    if body.username != settings.ADMIN_USERNAME or body.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    token = create_access_token(sub=body.username)
    return LoginResponse(token=token, admin=True)
