from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict, Any

from config.database import get_db
from models.inbody import InBodyReading
from models.user import User
from models import ClientProfile
from api.deps import get_current_user, hash_password
import random
import re

from pydantic import BaseModel

class ManualInBody(BaseModel):
    weight: float
    body_fat: float
    muscle_mass: float

router = APIRouter()

@router.post("/save")
def save_inbody_reading(data: dict, db: Session = Depends(get_db)):
    user_id = data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="يجب تحديد العميل.")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="العميل غير موجود.")
        
    ocr_data = data.get("ocr_data")
    if not ocr_data:
        raise HTTPException(status_code=400, detail="بيانات InBody غير مكتملة.")
        
    metrics = ocr_data.get("metrics", {})
    metabolism = ocr_data.get("metabolism", {})
    weight_control = ocr_data.get("weight_control", {})
    
    reading = InBodyReading(
        user_id=user_id,
        weight=float(metrics.get("weight", 0)),
        body_fat=float(metrics.get("tbf_percent", 0)),
        muscle_mass=float(metrics.get("sm_percent", 0)),
        total_body_water=float(metrics.get("tbw_percent", 0)) if metrics.get("tbw_percent") else None,
        
        bmi=float(metrics.get("bmi", 0)) if metrics.get("bmi") else None,
        vfi=float(metrics.get("vfi", 0)) if metrics.get("vfi") else None,
        ffm=float(metrics.get("ffm", 0)) if metrics.get("ffm") else None,
        fat_mass=float(metrics.get("fm", 0)) if metrics.get("fm") else None,
        tbw_percent=float(metrics.get("tbw_percent", 0)) if metrics.get("tbw_percent") else None,
        
        bmr=float(metabolism.get("bmr", 0)) if metabolism.get("bmr") else None,
        score=float(metabolism.get("total_score", 0)) if metabolism.get("total_score") else None,
        bio_age=float(metabolism.get("bio_age", 0)) if metabolism.get("bio_age") else None,
        
        target_weight=weight_control.get("reduce_weight"),
        target_fat=weight_control.get("reduce_fat"),
        target_muscle=weight_control.get("increase_muscle"),
        target_water=weight_control.get("increase_water")
    )
    
    db.add(reading)
    
    # Update the user's latest weight, body_fat, height, and age in the profile to keep it in sync
    if user.profile:
        if reading.weight > 0:
            user.profile.weight = reading.weight
        if reading.body_fat > 0:
            user.profile.body_fat = reading.body_fat
        
        profile_data = ocr_data.get("profile", {})
        
        # Parse height
        height_str = str(profile_data.get("height", ""))
        height_match = re.search(r'\d+', height_str)
        if height_match:
            user.profile.height = float(height_match.group())
            
        # Parse age
        age_str = str(profile_data.get("age", ""))
        age_match = re.search(r'\d+', age_str)
        if age_match:
            user.profile.age = int(age_match.group())
            
    db.commit()
    db.refresh(reading)
    
    return {"message": "تم الحفظ بنجاح", "reading_id": reading.id}

def arabic_to_english_username(name: str) -> str:
    """Helper to convert arabic name to english username"""
    mapping = {
        'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
        'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's',
        'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
        'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
        'ة': 'a', 'ى': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'a', 'ؤ': 'o', 'ئ': 'e', ' ': '_'
    }
    # Remove non-arabic or non-space characters
    clean_name = re.sub(r'[^أ-يa-zA-Z ]', '', name)
    eng_name = ""
    for char in clean_name:
        if char in mapping:
            eng_name += mapping[char]
        else:
            eng_name += char.lower()
    return eng_name.strip('_')

@router.post("/quick-create")
def auto_create_client_from_inbody(data: dict, db: Session = Depends(get_db)):
    ocr_data = data.get("ocr_data")
    if not ocr_data:
        raise HTTPException(status_code=400, detail="بيانات InBody غير مكتملة.")
        
    profile_data = ocr_data.get("profile", {})
    full_name = profile_data.get("name", "Unknown Client").strip()
    
    # 1. Generate Username
    base_username = arabic_to_english_username(full_name)
    if not base_username:
        base_username = "client"
    
    # ensure uniqueness
    username = f"{base_username}_{random.randint(100, 9999)}"
    while db.query(User).filter(User.username == username).first():
        username = f"{base_username}_{random.randint(100, 9999)}"
        
    # 2. Generate Password
    plain_password = f"form{random.randint(1000, 9999)}"
    
    # 3. Create User
    new_user = User(
        username=username,
        full_name=full_name,
        hashed_password=hash_password(plain_password),
        role="user"
    )
    db.add(new_user)
    db.flush() # get new_user.id
    
    # Extract height for profile
    height_str = profile_data.get("height", "")
    height_match = re.search(r'\d+', height_str)
    height = float(height_match.group()) if height_match else None

    # Extract age for profile
    age_str = profile_data.get("age", "")
    age_match = re.search(r'\d+', age_str)
    age = int(age_match.group()) if age_match else None

    # 4. Save InBody Reading (This will also commit the transaction)
    save_inbody_reading({"user_id": new_user.id, "ocr_data": ocr_data}, db)
    
    # 5. Create ClientProfile if not created (save_inbody_reading commits, so we query it)
    existing_profile = db.query(ClientProfile).filter_by(user_id=new_user.id).first()
    if not existing_profile:
        client_profile = ClientProfile(
            user_id=new_user.id,
            height=height,
            age=age,
            subscription_type="مجاني (تجريبي)",
            goal="إنقاص الوزن" if ocr_data.get("weight_control", {}).get("reduce_weight") else "زيادة العضلات"
        )
        db.add(client_profile)
        db.commit()
    else:
        existing_profile.height = height
        existing_profile.age = age
        existing_profile.subscription_type = "مجاني (تجريبي)"
        existing_profile.goal = "إنقاص الوزن" if ocr_data.get("weight_control", {}).get("reduce_weight") else "زيادة العضلات"
        db.commit()
    
    
    return {
        "message": "تم إنشاء الحساب وحفظ القراءة بنجاح!",
        "username": username,
        "password": plain_password,
        "full_name": full_name
    }



@router.get("/client/{user_id}")
def get_client_inbody_history(user_id: int, db: Session = Depends(get_db)):
    readings = db.query(InBodyReading).filter(
        InBodyReading.user_id == user_id
    ).order_by(desc(InBodyReading.reading_date)).all()
    
    result = []
    for r in readings:
        result.append({
            "id": r.id,
            "reading_date": r.reading_date.strftime("%Y-%m-%d"),
            "weight": r.weight,
            "body_fat": r.body_fat,
            "muscle_mass": r.muscle_mass,
            "total_body_water": r.total_body_water,
            "bmi": r.bmi,
            "vfi": r.vfi,
            "ffm": r.ffm,
            "fat_mass": r.fat_mass,
            "tbw_percent": r.tbw_percent,
            "bmr": r.bmr,
            "score": r.score,
            "bio_age": r.bio_age,
            "target_weight": r.target_weight,
            "target_fat": r.target_fat,
            "target_muscle": r.target_muscle,
            "target_water": r.target_water
        })
    return result

@router.get("/me")
def get_my_inbody_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_client_inbody_history(current_user.id, db)

@router.post("/manual")
def add_manual_inbody(data: ManualInBody, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reading = InBodyReading(
        user_id=current_user.id,
        weight=data.weight,
        body_fat=data.body_fat,
        muscle_mass=data.muscle_mass
    )
    db.add(reading)
    
    if current_user.profile:
        current_user.profile.weight = data.weight
        current_user.profile.body_fat = data.body_fat
        current_user.profile.muscle_mass = data.muscle_mass
        
    db.commit()
    db.refresh(reading)
    return {"message": "تم إضافة القراءة بنجاح"}

@router.delete("/{reading_id}")
def delete_inbody(reading_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reading = db.query(InBodyReading).filter(InBodyReading.id == reading_id).first()
    if not reading:
        raise HTTPException(status_code=404, detail="القراءة غير موجودة")
        
    if reading.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="غير مصرح لك بمسح هذه القراءة")
        
    db.delete(reading)
    db.commit()
    return {"message": "تم مسح القراءة بنجاح"}


# ── User: Upload Own Body Progress Photos ──

import cloudinary
import cloudinary.uploader
from fastapi import File, UploadFile

cloudinary.config(
  cloud_name='a41n5x6q',
  api_key='899781447338393',
  api_secret='m_P69u4vqCBqeVxzfOtYSAqu5po'
)

@router.post("/my-photos")
async def upload_my_body_photos(
    front: UploadFile = File(None),
    back: UploadFile = File(None),
    side: UploadFile = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """يخلي العميل يرفع صوره بنفسه (وش/ظهر/جنب)، وتظهر عند الأدمن تلقائياً"""
    profile = db.query(ClientProfile).filter(ClientProfile.user_id == current_user.id).first()
    if not profile:
        profile = ClientProfile(user_id=current_user.id)
        db.add(profile)

    if not (front and front.filename) and not (back and back.filename) and not (side and side.filename):
        raise HTTPException(status_code=400, detail="اختر صورة واحدة على الأقل")

    async def upload_photo(file: UploadFile, tag: str) -> str:
        contents = await file.read()
        from datetime import datetime as dt
        res = cloudinary.uploader.upload(
            contents,
            folder=f"body_photos/{current_user.id}",
            public_id=f"{current_user.id}_{tag}_{dt.utcnow().strftime('%Y%m%d%H%M%S')}",
            resource_type="image"
        )
        return res.get("secure_url", "")

    uploaded = {}
    if front and front.filename:
        profile.body_photo_front = await upload_photo(front, "front")
        uploaded["front"] = profile.body_photo_front
    if back and back.filename:
        profile.body_photo_back = await upload_photo(back, "back")
        uploaded["back"] = profile.body_photo_back
    if side and side.filename:
        profile.body_photo_side = await upload_photo(side, "side")
        uploaded["side"] = profile.body_photo_side

    if uploaded:
        from datetime import datetime as dt
        profile.body_photo_date = dt.utcnow()

    db.commit()
    return {
        "status": "ok",
        "uploaded": uploaded,
        "photo_date": profile.body_photo_date.strftime("%Y-%m-%d") if profile.body_photo_date else ""
    }


@router.get("/my-photos")
def get_my_body_photos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """جيب صور تقدم العميل الحالي"""
    profile = db.query(ClientProfile).filter(ClientProfile.user_id == current_user.id).first()
    if not profile:
        return {"front": None, "back": None, "side": None, "date": None}
    return {
        "front": profile.body_photo_front,
        "back": profile.body_photo_back,
        "side": profile.body_photo_side,
        "date": profile.body_photo_date.strftime("%Y-%m-%d") if profile.body_photo_date else None
    }


@router.delete("/my-photos/{slot}")
def delete_my_body_photo(
    slot: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """مسح صورة واحدة (front / back / side) من صور تقدم العميل"""
    if slot not in ("front", "back", "side"):
        raise HTTPException(status_code=400, detail="slot يجب أن يكون front أو back أو side")

    profile = db.query(ClientProfile).filter(ClientProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="الملف الشخصي غير موجود")

    if slot == "front":
        profile.body_photo_front = None
    elif slot == "back":
        profile.body_photo_back = None
    elif slot == "side":
        profile.body_photo_side = None

    # If all photos are gone, clear the date too
    if not profile.body_photo_front and not profile.body_photo_back and not profile.body_photo_side:
        profile.body_photo_date = None

    db.commit()
    return {"status": "ok", "deleted": slot}
