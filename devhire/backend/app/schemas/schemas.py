from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    company_name: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    company_name: Optional[str] = None
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class JobCreate(BaseModel):
    title: str
    location: str
    job_type: str
    description: str
    salary_range: Optional[str] = None

class JobOut(JobCreate):
    id: int
    owner_id: int
    company_name: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class ApplicationCreate(BaseModel):
    job_id: int
    cover_letter: Optional[str] = None

class ApplicationOut(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    cover_letter: Optional[str]
    status: str
    created_at: datetime
    candidate: Optional[UserOut] = None
    job: Optional[JobOut] = None
    class Config:
        from_attributes = True
