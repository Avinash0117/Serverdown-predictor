from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Incident
from schemas import IncidentResponse, IncidentCreate
from auth import get_current_user

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get("", response_model=List[IncidentResponse])
async def get_incidents(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    incidents = db.query(Incident).order_by(Incident.timestamp.desc()).limit(limit).all()
    return incidents

@router.post("/create")
async def create_incident(
    incident: IncidentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_incident = Incident(
        severity=incident.severity,
        message=incident.message,
        status="active"
    )
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return {"id": db_incident.id, "message": "Incident created"}
