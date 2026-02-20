from fastapi import APIRouter, Depends
from database import get_db
from schemas import UpdateRiskRequest, UpdateRiskResponse
from services.risk_predictor import RiskPredictor
from auth import get_current_user

router = APIRouter(prefix="/predict", tags=["predict"])

@router.post("/update-risk", response_model=UpdateRiskResponse)
async def predict_update_risk(
    request: UpdateRiskRequest,
    db = Depends(get_db),
    current_user = Depends(get_current_user)
):
    predictor = RiskPredictor()
    result = predictor.predict_risk(
        update_title=request.update_title,
        update_type=request.update_type,
        services_affected=request.services_affected,
        db_migration=request.db_migration,
        expected_minutes=request.expected_minutes,
        description=request.description
    )
    return UpdateRiskResponse(**result)
