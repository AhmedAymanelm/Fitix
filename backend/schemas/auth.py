from datetime import datetime
from pydantic import BaseModel, Field


# ── Request schemas ──

class UserLogin(BaseModel):
    username: str = Field(..., min_length=2, max_length=50, examples=["omar.fit"])
    password: str = Field(..., max_length=128, examples=["Fx1234!"])

class UpdateCredentials(BaseModel):
    new_username: str | None = Field(None, min_length=2, max_length=50)
    new_password: str | None = Field(None, min_length=4, max_length=128)


class UserCreate(BaseModel):
    username: str = Field(..., min_length=2, max_length=50, examples=["ahmed.fit"])
    full_name: str = Field(..., min_length=2, max_length=100, examples=["أحمد محمد"])
    phone: str | None = Field(None, max_length=20, examples=["01012345678"])
    password: str = Field(..., min_length=4, max_length=128, examples=["Fx1234!"])
    role: str = Field("user", pattern="^(admin|user)$", examples=["user"])


# ── Response schemas ──

class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str
    phone: str | None
    role: str
    is_active: bool
    cv_access: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    message: str
