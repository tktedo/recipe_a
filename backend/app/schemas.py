from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# --- Auth ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --- Memo ---

class MemoBase(BaseModel):
    title: str
    content: str


class MemoCreate(MemoBase):
    pass


class MemoUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class MemoResponse(MemoBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
