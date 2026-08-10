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
    # حفظ الملف
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".png", ".jpg", ".jpeg", ".svg", ".webp"]:
        return {"error": "صيغة الملف غير مدعومة"}

    logo_path = os.path.join(UPLOAD_DIR, f"gym_logo{ext}")
    with open(logo_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    logo_url = f"/uploads/logos/gym_logo{ext}"

    s = db.query(GymSettings).first()
    if not s:
        s = GymSettings()
        db.add(s)
    s.logo_url = logo_url
    db.commit()

    return {"status": "ok", "logo_url": logo_url}
