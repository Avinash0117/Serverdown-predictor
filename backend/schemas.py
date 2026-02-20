from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Auth schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Metrics schemas
class MetricsResponse(BaseModel):
    status: str  # operational, degraded, down, maintenance
    cpu: float
    ram: float
    response_time: float
    error_rate: float
    db_latency: float
    timestamp: datetime

# Incident schemas
class IncidentCreate(BaseModel):
    severity: str
    message: str

class IncidentResponse(BaseModel):
    id: int
    timestamp: datetime
    severity: str
    message: str
    status: str
    
    class Config:
        from_attributes = True

# Maintenance schemas
class MaintenanceResponse(BaseModel):
    enabled: bool
    eta_minutes: Optional[int] = None
    enabled_at: Optional[datetime] = None

class MaintenanceEnable(BaseModel):
    eta_minutes: int

# Update prediction schemas
class UpdateRiskRequest(BaseModel):
    update_title: str
    update_type: str  # minor, major, hotfix
    services_affected: List[str]
    db_migration: bool
    expected_minutes: int
    description: str

class UpdateRiskResponse(BaseModel):
    risk_score: int
    risk_level: str  # Low, Medium, High
    predicted_downtime_min: int
    predicted_downtime_max: int
    reasons: List[str]
    recommendations: List[str]
