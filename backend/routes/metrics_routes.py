from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database import get_db
from models import MaintenanceState, Incident
from schemas import MetricsResponse
from services.metrics_simulator import MetricsSimulator

router = APIRouter(prefix="/metrics", tags=["metrics"])
simulator = MetricsSimulator()

def check_and_create_incidents(db: Session, metrics: dict):
    """Automatically create incidents when thresholds are exceeded"""
    # Check for error rate spike
    if metrics["error_rate"] > 15:
        # Check if we already created a critical incident recently (within last 5 minutes)
        recent = db.query(Incident).filter(
            Incident.message.like("%Error rate spike%"),
            Incident.timestamp > datetime.utcnow() - timedelta(minutes=5)
        ).first()
        if not recent:
            incident = Incident(
                severity="critical",
                message=f"Error rate spike detected: {metrics['error_rate']:.2f}%",
                status="active"
            )
            db.add(incident)
    
    # Check for high latency
    elif metrics["response_time"] > 2000:
        recent = db.query(Incident).filter(
            Incident.message.like("%High latency detected%"),
            Incident.timestamp > datetime.utcnow() - timedelta(minutes=5)
        ).first()
        if not recent:
            incident = Incident(
                severity="high",
                message=f"High latency detected: {metrics['response_time']:.0f}ms",
                status="active"
            )
            db.add(incident)
    
    # Check for degraded performance
    elif metrics["error_rate"] > 5 or metrics["response_time"] > 1200:
        recent = db.query(Incident).filter(
            Incident.message.like("%Degraded performance%"),
            Incident.timestamp > datetime.utcnow() - timedelta(minutes=10)
        ).first()
        if not recent:
            incident = Incident(
                severity="medium",
                message=f"Degraded performance: Error rate {metrics['error_rate']:.2f}%, Response time {metrics['response_time']:.0f}ms",
                status="active"
            )
            db.add(incident)
    
    db.commit()

@router.get("/live", response_model=MetricsResponse)
async def get_live_metrics(db: Session = Depends(get_db)):
    # Check maintenance state
    maintenance = db.query(MaintenanceState).first()
    maintenance_enabled = maintenance.enabled if maintenance else False
    
    metrics = simulator.generate_metrics(maintenance_enabled=maintenance_enabled)
    
    # Auto-create incidents for anomalies
    check_and_create_incidents(db, metrics)
    
    return MetricsResponse(**metrics)
