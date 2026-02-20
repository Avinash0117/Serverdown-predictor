from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import User, MaintenanceState
from auth import get_password_hash
from routes import auth_routes, metrics_routes, incident_routes, maintenance_routes, predict_routes

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create default admin user on startup"""
    db: Session = next(get_db())
    try:
        admin_email = "admin@uptimeguard.ai"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                email=admin_email,
                password_hash=get_password_hash("admin123")
            )
            db.add(admin)
            db.commit()
            print(f"✅ Default admin user created: {admin_email} / admin123")
        else:
            print(f"✅ Admin user already exists: {admin_email}")
        
        # Initialize maintenance state
        maintenance = db.query(MaintenanceState).first()
        if not maintenance:
            maintenance = MaintenanceState(enabled=False, eta_minutes=0)
            db.add(maintenance)
            db.commit()
            print("✅ Maintenance state initialized")
    except Exception as e:
        print(f"❌ Error during startup: {e}")
    finally:
        db.close()
    yield
    # Cleanup (if needed)

app = FastAPI(title="UptimeGuard AI API", version="1.0.0", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(metrics_routes.router)
app.include_router(incident_routes.router)
app.include_router(maintenance_routes.router)
app.include_router(predict_routes.router)

@app.get("/")
async def root():
    return {"message": "UptimeGuard AI API", "status": "operational"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
