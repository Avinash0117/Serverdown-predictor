from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import MaintenanceState
from schemas import MaintenanceResponse, MaintenanceEnable
from auth import get_current_user

router = APIRouter(prefix="/maintenance", tags=["maintenance"])

@router.get("", response_model=MaintenanceResponse)
async def get_maintenance_status(db: Session = Depends(get_db)):
    maintenance = db.query(MaintenanceState).first()
    if not maintenance:
        # Create default if doesn't exist
        maintenance = MaintenanceState(enabled=False, eta_minutes=0)
        db.add(maintenance)
        db.commit()
        db.refresh(maintenance)
    return maintenance

@router.post("/enable")
async def enable_maintenance(
    data: MaintenanceEnable,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    maintenance = db.query(MaintenanceState).first()
    if not maintenance:
        maintenance = MaintenanceState(enabled=True, eta_minutes=data.eta_minutes, enabled_at=datetime.utcnow())
        db.add(maintenance)
    else:
        maintenance.enabled = True
        maintenance.eta_minutes = data.eta_minutes
        maintenance.enabled_at = datetime.utcnow()
    db.commit()
    db.refresh(maintenance)
    return {"message": "Maintenance mode enabled", "eta_minutes": maintenance.eta_minutes}

@router.post("/disable")
async def disable_maintenance(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    maintenance = db.query(MaintenanceState).first()
    if not maintenance:
        maintenance = MaintenanceState(enabled=False, eta_minutes=0)
        db.add(maintenance)
    else:
        maintenance.enabled = False
        maintenance.eta_minutes = 0
        maintenance.enabled_at = None
    db.commit()
    return {"message": "Maintenance mode disabled"}
