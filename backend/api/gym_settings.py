"""
api/gym_settings.py — إعدادات الجيم (الاسم + اللون + اللوجو)
"""
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import os, shutil

from config.database import get_db
from models.notification import GymSettings
from api.deps import get_current_admin, get_current_user
from models.user import User
import cloudinary
import cloudinary.uploader

cloudinary.config(
  cloud_name = 'a41n5x6q',
  api_key = '899781447338393',
  api_secret = 'm_P69u4vqCBqeVxzfOtYSAqu5po'
)


router = APIRouter(prefix="/api/gym-settings", tags=["Gym Settings"])


UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads", "logos")
os.makedirs(UPLOAD_DIR, exist_ok=True)


class GymSettingsUpdate(BaseModel):
    gym_name: Optional[str] = None
    primary_color: Optional[str] = None
    logo_url: Optional[str] = None  # None = إزالة اللوجو



# ── GET: جلب الإعدادات (للجميع) ──
@router.get("")
def get_gym_settings(db: Session = Depends(get_db)):
    s = db.query(GymSettings).first()
    if not s:
        return {"gym_name": "Fitix", "primary_color": "#c8ff3d", "logo_url": None}

    return {
        "gym_name": s.gym_name,
        "primary_color": s.primary_color,
        "logo_url": s.logo_url,
    }


# ── PUT: تحديث الإعدادات (أدمن فقط) ──
@router.put("", dependencies=[Depends(get_current_admin)])
def update_gym_settings(payload: GymSettingsUpdate, db: Session = Depends(get_db)):
    s = db.query(GymSettings).first()
    if not s:
        s = GymSettings()
        db.add(s)

    if payload.gym_name is not None:
        s.gym_name = payload.gym_name
    if payload.primary_color is not None:
        s.primary_color = payload.primary_color
    if payload.logo_url is not None or 'logo_url' in payload.model_fields_set:
        s.logo_url = payload.logo_url

    db.commit()
    return {"status": "ok", "gym_name": s.gym_name, "primary_color": s.primary_color, "logo_url": s.logo_url}



# ── POST: رفع اللوجو (أدمن فقط) ──
@router.post("/logo", dependencies=[Depends(get_current_admin)])
async def upload_logo(file: UploadFile = File(...), db: Session = Depends(get_db)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".png", ".jpg", ".jpeg", ".svg", ".webp"]:
        return {"error": "صيغة الملف غير مدعومة"}

    contents = await file.read()
    res = cloudinary.uploader.upload(contents, folder="gym_logos", resource_type="auto")
    logo_url = res.get("secure_url")

    s = db.query(GymSettings).first()
    if not s:
        s = GymSettings()
        db.add(s)
    s.logo_url = logo_url
    db.commit()

    return {"status": "ok", "logo_url": logo_url}

class ApiKeyUpdate(BaseModel):
    api_key: str

@router.get("/api-key", dependencies=[Depends(get_current_admin)])
def get_api_key():
    key = os.getenv("GEMINI_API_KEY", "")
    if key and len(key) > 8:
        masked = key[:6] + "•" * 15 + key[-4:]
    else:
        masked = ""
    return {"api_key": masked, "has_key": bool(key)}

@router.post("/api-key", dependencies=[Depends(get_current_admin)])
def update_api_key(payload: ApiKeyUpdate):
    import re
    new_key = payload.api_key.strip()
    os.environ["GEMINI_API_KEY"] = new_key
    
    # Update .env file
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
    
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            content = f.read()
        
        if "GEMINI_API_KEY=" in content:
            content = re.sub(r'GEMINI_API_KEY=.*', f'GEMINI_API_KEY={new_key}', content)
        else:
            if content and not content.endswith('\n'):
                content += '\n'
            content += f"GEMINI_API_KEY={new_key}\n"
            
        with open(env_path, "w") as f:
            f.write(content)
    else:
        with open(env_path, "w") as f:
            f.write(f"GEMINI_API_KEY={new_key}\n")
            
    return {"status": "ok"}
