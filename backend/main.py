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

def upgrade_db_schema():
    from sqlalchemy import text
    import traceback
    # Use AUTOCOMMIT so that if one column already exists and throws an error, 
    # it doesn't abort the entire transaction block in PostgreSQL.
    with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
        # Add new columns to nutrition_plans
        cols_nutrition = [
            "total_protein FLOAT",
            "total_carbs FLOAT",
            "total_fats FLOAT",
            "caloric_deficit INTEGER",
            "bmr_used INTEGER",
            "workout_day_calories INTEGER",
            "rest_day_calories INTEGER",
            "admin_notes VARCHAR(2000)",
            "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
            "start_date TIMESTAMP",
            "end_date TIMESTAMP"
        ]
        for col in cols_nutrition:
            try:
                conn.execute(text(f"ALTER TABLE nutrition_plans ADD COLUMN {col}"))
            except Exception as e:
                if "already exists" not in str(e) and "Duplicate column" not in str(e):
                    print(f"Error adding {col} to nutrition_plans: {e}")
                
        # Add new columns to inbody_readings
        cols_inbody = [
            "bmi FLOAT",
            "vfi FLOAT",
            "ffm FLOAT",
            "fat_mass FLOAT",
            "tbw_percent FLOAT",
            "bmr FLOAT",
            "score FLOAT",
            "bio_age FLOAT",
            "target_weight TEXT",
            "target_fat TEXT",
            "target_muscle TEXT",
            "target_water TEXT",
            "image_url TEXT"
        ]
        for col in cols_inbody:
            try:
                conn.execute(text(f"ALTER TABLE inbody_readings ADD COLUMN {col}"))
            except Exception as e:
                if "already exists" not in str(e) and "Duplicate column" not in str(e):
                    print(f"Error adding {col} to inbody_readings: {e}")
        
        # Alter meals.items from VARCHAR(500) to TEXT to support large JSON
        try:
            conn.execute(text("ALTER TABLE meals ALTER COLUMN items TYPE TEXT"))
            print("✅ meals.items changed to TEXT")
        except Exception as e:
            print(f"meals.items alter: {e}")

upgrade_db_schema()


import traceback
from fastapi import Request
from fastapi.responses import JSONResponse

# ── App ──
app = FastAPI(
    title="FORM Fitness OS — API",
    description="نظام إدارة الجيم بالذكاء الاصطناعي",
    version="1.0.0",
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    # Return 500 but with detail containing the traceback
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error\n\n{tb}"}
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
    from fastapi.responses import HTMLResponse

    @app.get("/", tags=["Frontend"])
    def serve_index():
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            html = f.read()

        # Load responsive assets after the legacy stylesheet.
        responsive_link = '<link rel="stylesheet" href="/css/responsive.css">'
        responsive_script = '<script src="/js/core/responsive.js" defer></script>'
        if "/css/responsive.css" not in html:
            html = html.replace("</head>", f"{responsive_link}\n</head>", 1)
        if "/js/core/responsive.js" not in html:
            html = html.replace("</head>", f"{responsive_script}\n</head>", 1)

        return HTMLResponse(content=html)

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

import asyncio
from api.notifications import run_daily_notification_check_logic

@app.on_event("startup")
async def start_background_jobs():
    async def daily_notifications_job():
        while True:
            try:
                db = SessionLocal()
                created = run_daily_notification_check_logic(db)
                db.close()
                if created > 0:
                    print(f"✅ Daily notification check ran: {created} notifications sent.")
            except Exception as e:
                print(f"⚠️ Error running daily notification check: {e}")
            
            # Run every 24 hours
            await asyncio.sleep(86400)
            
    asyncio.create_task(daily_notifications_job())
    print("✅ Background daily notification job started.")
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
