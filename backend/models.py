"""Pydantic request models."""
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class SubmissionInput(BaseModel):
    type: str = Field(..., pattern="^(contact|volunteer|partner)$")
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    city: Optional[str] = None
    interest: Optional[str] = None
    organization: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    # honeypot field - real users never fill this
    website: Optional[str] = None


class NewsletterInput(BaseModel):
    email: EmailStr


class DonationInput(BaseModel):
    donor_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    amount: float = Field(..., gt=0)
    frequency: str = Field("one_time", pattern="^(one_time|monthly)$")
    program_id: Optional[str] = None
    program_title: Optional[str] = None
    note: Optional[str] = None


class StatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(new|read|responded)$")
