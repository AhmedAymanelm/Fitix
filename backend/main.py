import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from fastapi.middleware.cors import CORSMiddleware

from config.settings import CORS_ORIGINS
from config.database import engine, SessionLocal, Base
from models import User, ClientProfile, Exercise, WorkoutPlan, WorkoutExercise, WorkoutLog, NutritionPlan, Meal, InBodyReading, FitnessTest, Message, Notification, NotificationSettings, GymSettings  # noqa: F401
from api.auth import router as auth_router
from api.admin import router as admin_router
from api.chat import router as chat_router
from api.workout import router as workout_router
from api.ai import router as ai_router
from api.inbody import router as inbody_router
from api.cv_ws import router as cv_ws_router
from api.fitness_tests import router as fitness_tests_router
from api.notifications import router as notifications_router
from api.gym_settings import router as gym_settings_router
from api.deps import hash_password

# ── Create tables ──
Base.metadata.create_all(bind=engine)

# ── App ──
app = FastAPI(
    title="FORM Fitness OS — API",
    description="نظام إدارة الجيم بالذكاء الاصطناعي",
    version="1.0.0",
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(chat_router)
app.include_router(workout_router)
app.include_router(ai_router, prefix="/api/ai", tags=["AI OCR"])
app.include_router(inbody_router, prefix="/api/inbody", tags=["InBody"])
app.include_router(cv_ws_router, tags=["CV Tracker Websocket"])
app.include_router(fitness_tests_router)
app.include_router(notifications_router)
app.include_router(gym_settings_router)

# ── Static Files (Uploads) ──
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ── Serve Frontend (for Railway — single service) ──
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend")
if os.path.exists(FRONTEND_DIR):
    from fastapi.responses import FileResponse

    @app.get("/", tags=["Frontend"])
    def serve_index():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

    # Mount frontend static assets (css, js, etc.)
    app.mount("/css", StaticFiles(directory=os.path.join(FRONTEND_DIR, "css")), name="css")
    app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")
else:
    @app.get("/", tags=["Health"])
    def root():
        return {"status": "ok", "app": "FORM Fitness OS"}


# ── Seed data ──
def seed_demo_data():
    """Create demo admin + user if they don't exist yet."""
    db = SessionLocal()
    try:
        # Admin (المدرب)
        if not db.query(User).filter(User.username == "admin").first():
            db.add(User(
                username="admin",
                full_name="كابتن الجيم",
                phone="01000000000",
                hashed_password=hash_password("Fx1234!"),
                role="admin",
            ))
            print("✅ Seeded admin user: admin / Fx1234!")

        # User (العميل)
        if not db.query(User).filter(User.username == "omar.fit").first():
            db.add(User(
                username="omar.fit",
                full_name="عمر حسن",
                phone="01012345678",
                hashed_password=hash_password("Fx1234!"),
                role="user",
            ))
            print("✅ Seeded client user: omar.fit / Fx1234!")

        db.commit()
    except Exception as e:
        print(f"⚠️ Seed error (may be OK if already seeded): {e}")
        db.rollback()
    finally:
        db.close()


seed_demo_data()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
