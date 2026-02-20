import random
from typing import List

class RiskPredictor:
    def __init__(self):
        pass
    
    def predict_risk(self, update_title: str, update_type: str, services_affected: List[str],
                    db_migration: bool, expected_minutes: int, description: str) -> dict:
        """Rule-based risk prediction (can be replaced with ML later)"""
        risk_score = 0
        reasons = []
        recommendations = []
        
        # Update type scoring
        if update_type == "major":
            risk_score += 25
            reasons.append("Major updates have higher risk of breaking changes")
            recommendations.append("Consider staging environment testing before production")
        elif update_type == "hotfix":
            risk_score += 15
            reasons.append("Hotfixes are often rushed and may introduce new issues")
            recommendations.append("Ensure comprehensive testing despite urgency")
        else:  # minor
            risk_score += 5
            reasons.append("Minor updates typically have lower risk")
        
        # Database migration scoring
        if db_migration:
            risk_score += 30
            reasons.append("Database migrations increase rollback complexity")
            recommendations.append("Create database backup before migration")
            recommendations.append("Test migration on staging environment first")
            recommendations.append("Have rollback script ready")
        
        # Critical services scoring
        critical_services = ["payments", "database", "auth"]
        affected_critical = [s for s in services_affected if s.lower() in critical_services]
        if affected_critical:
            risk_score += 20 * len(affected_critical)
            reasons.append(f"Critical services affected: {', '.join(affected_critical)}")
            recommendations.append("Schedule update during low-traffic period")
            recommendations.append("Enable maintenance mode before deployment")
        
        # Expected duration scoring
        if expected_minutes > 15:
            risk_score += 15
            reasons.append("Longer deployment windows increase exposure to issues")
            recommendations.append("Break down into smaller, incremental updates if possible")
        elif expected_minutes > 30:
            risk_score += 10  # Additional for very long deployments
        
        # Description keyword analysis
        description_lower = description.lower()
        high_risk_keywords = ["schema", "migration", "refactor", "breaking", "restructure"]
        found_keywords = [kw for kw in high_risk_keywords if kw in description_lower]
        if found_keywords:
            risk_score += 10
            reasons.append(f"Description contains high-risk keywords: {', '.join(found_keywords)}")
        
        # Multiple services affected
        if len(services_affected) > 3:
            risk_score += 10
            reasons.append("Multiple services affected increases coordination complexity")
            recommendations.append("Consider deploying services sequentially")
        
        # Determine risk level
        if risk_score <= 30:
            risk_level = "Low"
        elif risk_score <= 60:
            risk_level = "Medium"
        else:
            risk_level = "High"
            recommendations.append("Consider postponing if not critical")
            recommendations.append("Ensure full team is available during deployment")
        
        # Calculate predicted downtime range
        base_minutes = expected_minutes
        # Add buffer based on risk
        risk_multiplier = 1 + (risk_score / 100) * 0.5  # Up to 50% additional time
        predicted_min = max(1, int(base_minutes * 0.8))  # 20% less than expected
        predicted_max = int(base_minutes * (1.4 + (risk_score / 100) * 0.3))  # 40-70% more
        
        # Add default recommendations
        if not recommendations:
            recommendations.append("Standard deployment procedures should be sufficient")
        
        return {
            "risk_score": min(100, risk_score),
            "risk_level": risk_level,
            "predicted_downtime_min": predicted_min,
            "predicted_downtime_max": predicted_max,
            "reasons": reasons if reasons else ["Low risk deployment"],
            "recommendations": recommendations
        }
