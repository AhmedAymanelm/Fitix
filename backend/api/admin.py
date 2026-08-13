from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from sqlalchemy import func
import cloudinary
import cloudinary.uploader
import json
from typing import Optional, List
from datetime import datetime

cloudinary.config(
  cloud_name = 'a41n5x6q',
  api_key = '899781447338393',
  api_secret = 'm_P69u4vqCBqeVxzfOtYSAqu5po'
)

from config.database import get_db
from models.user import User
from models.client_profile import ClientProfile
from models.exercise import Exercise
from models.nutrition import FoodItem, NutritionPlan, Meal
from models.notification import Notification
from api.deps import get_current_admin, hash_password
from schemas.auth import UserResponse
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/admin", tags=["Admin"], dependencies=[Depends(get_current_admin)])

# ── Schemas for Admin ──
class DashboardStats(BaseModel):
    total_clients: int
    active_clients: int
    pending_plans: int
    new_messages: int

class ClientCreate(BaseModel):
    full_name: str
    phone: str
    username: str
    password: str
    # Subscription
    service_type: Optional[str] = None          # "nutrition" / "nutrition_fitness" / "gym_workout"
    subscription_type: Optional[str] = None     # "شهري" / "ربع سنوي" / "سنوي"
    subscription_start: Optional[str] = None    # YYYY-MM-DD
    subscription_end: Optional[str] = None      # YYYY-MM-DD
    goal: Optional[str] = None
    # Body
    weight: Optional[float] = None
    height: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    # Workout
    is_active_workout: Optional[bool] = False
    workout_days_per_week: Optional[int] = None
    workout_type: Optional[str] = None
    workout_schedule: Optional[str] = None      # JSON string
    sport_type: Optional[str] = None
    # Health
    has_injury: Optional[bool] = False
    injury_details: Optional[str] = None        # JSON string
    takes_medication: Optional[bool] = False
    medication_details: Optional[str] = None    # JSON string
    has_health_issues: Optional[bool] = False
    health_issues_details: Optional[str] = None
    notes: Optional[str] = None

class ClientProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    goal: Optional[str] = None
    service_type: Optional[str] = None
    subscription_type: Optional[str] = None
    subscription_start: Optional[str] = None
    subscription_end: Optional[str] = None
    is_active_workout: Optional[bool] = None
    workout_days_per_week: Optional[int] = None
    workout_type: Optional[str] = None
    workout_schedule: Optional[str] = None
    sport_type: Optional[str] = None
    has_injury: Optional[bool] = None
    injury_details: Optional[str] = None
    takes_medication: Optional[bool] = None
    medication_details: Optional[str] = None
    has_health_issues: Optional[bool] = None
    health_issues_details: Optional[str] = None
    notes: Optional[str] = None

class FoodItemBase(BaseModel):
    name: str
    category: Optional[str] = None
    calories: float
    protein: float
    carbs: float
    fats: float

class FoodItemCreate(FoodItemBase):
    pass

class FoodItemUpdate(FoodItemBase):
    pass

# ── Dashboard ──
@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """جلب إحصائيات لوحة التحكم مع بيانات حقيقية."""
    from models.inbody import InBodyReading
    from models.message import Message
    
    total_clients = db.query(User).filter(User.role == "user").count()
    active = db.query(User).filter(User.role == "user", User.is_active == True).count()
    inactive = total_clients - active
    
    # Count unread messages sent TO admin (receiver_id = admin)
    admin_user = db.query(User).filter(User.role == "admin").first()
    unread_msgs = 0
    if admin_user:
        unread_msgs = db.query(Message).filter(
            Message.receiver_id == admin_user.id,
            Message.is_read == False
        ).count()
    
    # Total InBody readings
    total_readings = db.query(InBodyReading).count()
    
    # Recent InBody readings (last 5)
    recent_readings = db.query(InBodyReading).order_by(InBodyReading.created_at.desc()).limit(5).all()
    recent_readings_data = []
    for r in recent_readings:
        client_name = r.user.full_name if r.user else "غير معروف"
        recent_readings_data.append({
            "client_name": client_name,
            "weight": r.weight,
            "body_fat": r.body_fat,
            "muscle_mass": r.muscle_mass,
            "date": r.reading_date.strftime("%Y-%m-%d") if r.reading_date else "",
            "score": r.score
        })
    
    # Client overview: all clients with their latest stats + leaderboard data
    clients = db.query(User).filter(User.role == "user").order_by(User.created_at.desc()).all()
    client_overview = []
    leaderboard_raw = []
    total_weight = 0
    total_fat = 0
    total_muscle = 0
    clients_with_readings = 0
    
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    alerts = []
    
    for c in clients:
        all_readings = db.query(InBodyReading).filter(
            InBodyReading.user_id == c.id
        ).order_by(InBodyReading.reading_date.asc()).all()
        
        readings_count = len(all_readings)
        latest_reading = all_readings[-1] if all_readings else None
        first_reading = all_readings[0] if all_readings else None
        
        client_overview.append({
            "id": c.id,
            "name": c.full_name,
            "is_active": c.is_active,
            "readings_count": readings_count,
            "weight": latest_reading.weight if latest_reading else None,
            "body_fat": latest_reading.body_fat if latest_reading else None,
            "muscle_mass": latest_reading.muscle_mass if latest_reading else None,
            "last_reading_date": latest_reading.reading_date.strftime("%Y-%m-%d") if latest_reading and latest_reading.reading_date else None
        })
        
        # Averages calculation
        if latest_reading:
            total_weight += latest_reading.weight
            total_fat += latest_reading.body_fat
            total_muscle += latest_reading.muscle_mass
            clients_with_readings += 1
        
        # Leaderboard: compare first vs last reading
        if first_reading and latest_reading and readings_count >= 2:
            fat_change = latest_reading.body_fat - first_reading.body_fat  # negative = improved
            muscle_change = latest_reading.muscle_mass - first_reading.muscle_mass  # positive = improved
            weight_change = latest_reading.weight - first_reading.weight  # negative = lost weight
            leaderboard_raw.append({
                "name": c.full_name,
                "id": c.id,
                "fat_change": round(fat_change, 1),
                "muscle_change": round(muscle_change, 1),
                "weight_change": round(weight_change, 1),
                "readings": readings_count,
                "improvement_score": round(-fat_change + muscle_change, 1)  # higher = better
            })
        
        # Smart Alerts
        if not c.is_active:
            alerts.append({"type": "inactive", "name": c.full_name, "id": c.id, "msg": "حساب موقوف"})
        
        if latest_reading and latest_reading.reading_date:
            days_since = (now - latest_reading.reading_date).days
            if days_since > 30:
                alerts.append({"type": "no_reading", "name": c.full_name, "id": c.id, "msg": f"آخر قراءة من {days_since} يوم"})
        elif not latest_reading:
            alerts.append({"type": "no_reading", "name": c.full_name, "id": c.id, "msg": "لا توجد قراءة InBody"})
        
        if first_reading and latest_reading and readings_count >= 2:
            if latest_reading.weight > first_reading.weight:
                alerts.append({"type": "weight_up", "name": c.full_name, "id": c.id, "msg": f"وزنه زاد ({round(latest_reading.weight - first_reading.weight, 1)}+ kg)"})
    
    # Compute averages
    averages = {
        "avg_weight": round(total_weight / clients_with_readings, 1) if clients_with_readings else 0,
        "avg_fat": round(total_fat / clients_with_readings, 1) if clients_with_readings else 0,
        "avg_muscle": round(total_muscle / clients_with_readings, 1) if clients_with_readings else 0,
        "sample_size": clients_with_readings
    }
    
    # Sort leaderboard by improvement score (highest first)
    leaderboard = sorted(leaderboard_raw, key=lambda x: x["improvement_score"], reverse=True)[:5]
    
    # Recent messages (last 5)
    recent_messages = []
    if admin_user:
        msgs = db.query(Message).filter(
            Message.receiver_id == admin_user.id
        ).order_by(Message.sent_at.desc()).limit(5).all()
        for m in msgs:
            recent_messages.append({
                "sender_name": m.sender.full_name if m.sender else "غير معروف",
                "sender_id": m.sender_id,
                "content": m.content[:80] + ("..." if len(m.content) > 80 else ""),
                "is_read": m.is_read,
                "time": m.sent_at.strftime("%Y-%m-%d %H:%M") if m.sent_at else ""
            })
    
    # Monthly readings (last 6 months)
    monthly_readings = []
    for i in range(5, -1, -1):
        month_start = (now.replace(day=1) - timedelta(days=i * 30)).replace(day=1)
        if i > 0:
            month_end = (now.replace(day=1) - timedelta(days=(i - 1) * 30)).replace(day=1)
        else:
            month_end = now
        
        count = db.query(InBodyReading).filter(
            InBodyReading.created_at >= month_start,
            InBodyReading.created_at < month_end
        ).count()
        
        month_label = month_start.strftime("%b %Y")
        monthly_readings.append({"month": month_label, "count": count})
    
    return {
        "total_clients": total_clients,
        "active_clients": active,
        "inactive_clients": inactive,
        "new_messages": unread_msgs,
        "total_readings": total_readings,
        "pending_plans": 0,
        "recent_readings": recent_readings_data,
        "client_overview": client_overview,
        "averages": averages,
        "leaderboard": leaderboard,
        "alerts": alerts,
        "recent_messages": recent_messages,
        "monthly_readings": monthly_readings
    }

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    """جلب بيانات صفحة التحليلات الشاملة."""
    # Since we don't have real historical data, we return current stats
    total_clients = db.query(User).filter(User.role == "user").count()
    return {
        "total_clients": total_clients,
        "adherence_rate": 0,  # No real adherence data yet
        "ai_plans_generated": 0,
        "upcoming_renewals": 0,
        "leaderboard": [],
        "weekly_activity": [0,0,0,0,0,0,0]
    }

@router.get("/exercises")
def get_exercises(db: Session = Depends(get_db)):
    """جلب مكتبة التمارين."""
    exercises = db.query(Exercise).all()
    return [
        {
            "id": ex.id,
            "name": ex.name,
            "muscle_group": ex.muscle_group,
            "difficulty": ex.difficulty,
            "gif_url": ex.gif_url,
            "video_url": ex.video_url,
            "description": ex.description
        } for ex in exercises
    ]

@router.post("/exercises")
async def create_exercise(
    name: str = Form(...),
    muscle_group: str = Form("عام"),
    description: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """إضافة تمرين جديد برفع ملف"""
    contents = await file.read()
    res = cloudinary.uploader.upload(contents, folder="exercises", resource_type="auto")
    url = res.get("secure_url")
    
    ex = Exercise(
        name=name, 
        muscle_group=muscle_group, 
        description=description, 
        gif_url=url, 
        video_url=url
    )
    db.add(ex)
    db.commit()
    db.refresh(ex)
    return {"status": "ok", "id": ex.id}

@router.delete("/exercises/{ex_id}")
def delete_exercise(ex_id: int, db: Session = Depends(get_db)):
    """حذف تمرين"""
    ex = db.query(Exercise).filter(Exercise.id == ex_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exercise not found")
    db.delete(ex)
    db.commit()
    return {"status": "ok"}

@router.get("/nutrition/foods")
def get_food_items(category: str = None, db: Session = Depends(get_db)):
    """جلب دليل الأغذية."""
    q = db.query(FoodItem)
    if category:
        q = q.filter(FoodItem.category == category)
    items = q.all()
    return [
        {
            "id": f.id,
            "name": f.name,
            "category": f.category,
            "calories": f.calories,
            "protein": f.protein,
            "carbs": f.carbs,
            "fats": f.fats
        } for f in items
    ]

@router.post("/nutrition/foods")
def create_food_item(item: FoodItemCreate, db: Session = Depends(get_db)):
    """إضافة صنف طعام جديد."""
    new_item = FoodItem(
        name=item.name,
        category=item.category,
        calories=item.calories,
        protein=item.protein,
        carbs=item.carbs,
        fats=item.fats
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {"status": "ok", "id": new_item.id}

@router.put("/nutrition/foods/{item_id}")
def update_food_item(item_id: int, item: FoodItemUpdate, db: Session = Depends(get_db)):
    """تعديل صنف طعام."""
    db_item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db_item.name = item.name
    db_item.category = item.category
    db_item.calories = item.calories
    db_item.protein = item.protein
    db_item.carbs = item.carbs
    db_item.fats = item.fats
    
    db.commit()
    return {"status": "ok"}

@router.delete("/nutrition/foods/{item_id}")
def delete_food_item(item_id: int, db: Session = Depends(get_db)):
    """حذف صنف طعام."""
    db_item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"status": "ok"}

# ── Clients ──
@router.get("/clients")
def get_all_clients(db: Session = Depends(get_db)):
    """جلب كل العملاء مع تفاصيل بروفايلهم."""
    users = db.query(User).filter(User.role == "user").all()
    results = []
    for u in users:
        # Default mock values if profile doesn't exist yet
        w = f"{u.profile.weight} كجم" if u.profile and u.profile.weight else "غير محدد"
        bf = f"{u.profile.body_fat}%" if u.profile and u.profile.body_fat else "غير محدد"
        sub = u.profile.subscription_type if u.profile and u.profile.subscription_type else "غير محدد"
        
        results.append({
            "id": u.id,
            "full_name": u.full_name,
            "subscription": f"مشترك — {sub}",
            "weight": w,
            "body_fat": bf
        })
    return results

@router.post("/clients")
def create_client(payload: ClientCreate, db: Session = Depends(get_db)):
    """إضافة عميل جديد مع كل بياناته الصحية."""
    from api.notifications import notify_admin_new_client

    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="اسم المستخدم موجود بالفعل")
    
    new_user = User(
        username=payload.username,
        full_name=payload.full_name,
        phone=payload.phone,
        hashed_password=hash_password(payload.password),
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Parse dates
    sub_start = None
    sub_end = None
    try:
        if payload.subscription_start:
            sub_start = datetime.strptime(payload.subscription_start, "%Y-%m-%d")
        if payload.subscription_end:
            sub_end = datetime.strptime(payload.subscription_end, "%Y-%m-%d")
    except Exception:
        pass

    # Create profile with all intake data
    profile = ClientProfile(
        user_id=new_user.id,
        goal=payload.goal,
        service_type=payload.service_type,
        subscription_type=payload.subscription_type,
        subscription_start=sub_start,
        subscription_end=sub_end,
        weight=payload.weight,
        height=payload.height,
        age=payload.age,
        gender=payload.gender,
        is_active_workout=payload.is_active_workout,
        workout_days_per_week=payload.workout_days_per_week,
        workout_type=payload.workout_type,
        workout_schedule=payload.workout_schedule,
        sport_type=payload.sport_type,
        has_injury=payload.has_injury,
        injury_details=payload.injury_details,
        takes_medication=payload.takes_medication,
        medication_details=payload.medication_details,
        has_health_issues=payload.has_health_issues,
        health_issues_details=payload.health_issues_details,
        notes=payload.notes,
    )
    db.add(profile)
    db.commit()

    # Notify admin about new client
    try:
        notify_admin_new_client(db, new_user.full_name, new_user.id)
    except Exception:
        pass
    
    return {"message": "تم إضافة العميل بنجاح", "client_id": new_user.id}

@router.get("/clients/{client_id}")
def get_client_detail(client_id: int, db: Session = Depends(get_db)):
    """جلب تفاصيل عميل واحد — بيانات كاملة."""
    u = db.query(User).filter(User.id == client_id, User.role == "user").first()
    if not u:
        raise HTTPException(status_code=404, detail="العميل مش موجود")

    p = u.profile
    return {
        "id": u.id,
        "full_name": u.full_name,
        "username": u.username,
        "is_active": u.is_active,
        "phone": u.phone,
        "joined": u.created_at.strftime("%B %Y"),
        # Body
        "weight": p.weight if p else None,
        "height": p.height if p else None,
        "age": p.age if p else None,
        "gender": p.gender if p else None,
        "body_fat": p.body_fat if p else None,
        "muscle_mass": p.muscle_mass if p else None,
        # Subscription
        "goal": p.goal if p else None,
        "service_type": p.service_type if p else None,
        "subscription": p.subscription_type if p else None,
        "subscription_start": p.subscription_start.strftime("%Y-%m-%d") if p and p.subscription_start else None,
        "subscription_end": p.subscription_end.strftime("%Y-%m-%d") if p and p.subscription_end else None,
        # Workout
        "is_active_workout": p.is_active_workout if p else False,
        "workout_days_per_week": p.workout_days_per_week if p else None,
        "workout_type": p.workout_type if p else None,
        "workout_schedule": p.workout_schedule if p else None,
        "sport_type": p.sport_type if p else None,
        # Health
        "has_injury": p.has_injury if p else False,
        "injury_details": p.injury_details if p else None,
        "takes_medication": p.takes_medication if p else False,
        "medication_details": p.medication_details if p else None,
        "has_health_issues": p.has_health_issues if p else False,
        "health_issues_details": p.health_issues_details if p else None,
        "notes": p.notes if p else None,
        # Body photos
        "body_photo_front": p.body_photo_front if p else None,
        "body_photo_back": p.body_photo_back if p else None,
        "body_photo_side": p.body_photo_side if p else None,
        "body_photo_date": p.body_photo_date.strftime("%Y-%m-%d") if p and p.body_photo_date else None,
        # CV
        "cv_access": getattr(u, 'cv_access', False),
        "fitness_tests": [
            {
                "id": t.id,
                "date": t.test_date.strftime("%Y-%m-%d %H:%M") if t.test_date else "",
                "reps": t.reps_count,
                "duration": t.duration_seconds,
                "video_url": t.video_url
            } for t in u.fitness_tests
        ]
    }

@router.get("/clients/{client_id}/active-plan")
def get_client_active_plan(client_id: int, db: Session = Depends(get_db)):
    """جلب النظام الغذائي النشط للعميل"""
    plan = db.query(NutritionPlan).filter(
        NutritionPlan.user_id == client_id,
        NutritionPlan.is_active == True,
        NutritionPlan.status == "approved"
    ).first()
    
    if not plan:
        return None
        
    meals_data = []
    for m in plan.meals:
        meals_data.append({
            "id": m.id,
            "name": m.name,
            "items": m.items,
            "calories": m.calories
        })
        
    return {
        "id": plan.id,
        "goal": plan.goal,
        "daily_calories": plan.daily_calories,
        "meals": meals_data,
        "created_at": plan.created_at.strftime("%Y-%m-%d") if plan.created_at else ""
    }


class PasswordUpdate(BaseModel):
    new_password: str = Field(..., min_length=4)

@router.post("/clients/{client_id}/toggle-active")
def toggle_client_active(client_id: int, db: Session = Depends(get_db)):
    """تعطيل أو تفعيل حساب العميل."""
    u = db.query(User).filter(User.id == client_id, User.role == "user").first()
    if not u:
        raise HTTPException(status_code=404, detail="العميل مش موجود")
    u.is_active = not u.is_active
    db.commit()
    return {"message": "تم تحديث حالة الحساب", "is_active": u.is_active}

@router.post("/clients/{client_id}/toggle-cv-access")
def toggle_client_cv_access(client_id: int, db: Session = Depends(get_db)):
    """تفعيل أو تعطيل اختبار اللياقة بالكاميرا للعميل"""
    u = db.query(User).filter(User.id == client_id, User.role == "user").first()
    if not u:
        raise HTTPException(status_code=404, detail="العميل مش موجود")
    u.cv_access = not getattr(u, 'cv_access', False)
    db.commit()
    return {"message": "تم تحديث صلاحية الكاميرا", "cv_access": u.cv_access}

@router.put("/clients/{client_id}/password")
def update_client_password(client_id: int, payload: PasswordUpdate, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.id == client_id, User.role == "user").first()
    if not u:
        raise HTTPException(status_code=404, detail="العميل غير موجود")
    
    u.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"message": "تم تحديث كلمة المرور بنجاح"}

@router.put("/clients/{client_id}/profile")
def update_client_profile(client_id: int, payload: ClientProfileUpdate, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.id == client_id, User.role == "user").first()
    if not u:
        raise HTTPException(status_code=404, detail="العميل غير موجود")
        
    if payload.full_name is not None:
        u.full_name = payload.full_name
    if payload.phone is not None:
        u.phone = payload.phone
        
    profile = db.query(ClientProfile).filter(ClientProfile.user_id == client_id).first()
    if not profile:
        profile = ClientProfile(user_id=client_id)
        db.add(profile)

    # Update all fields
    for field in [
        'height', 'weight', 'age', 'gender', 'goal', 'service_type',
        'subscription_type', 'is_active_workout', 'workout_days_per_week',
        'workout_type', 'workout_schedule', 'sport_type', 'has_injury',
        'injury_details', 'takes_medication', 'medication_details',
        'has_health_issues', 'health_issues_details', 'notes'
    ]:
        val = getattr(payload, field, None)
        if val is not None:
            setattr(profile, field, val)

    # Parse dates
    if payload.subscription_start:
        try:
            profile.subscription_start = datetime.strptime(payload.subscription_start, "%Y-%m-%d")
        except Exception:
            pass
    if payload.subscription_end:
        try:
            profile.subscription_end = datetime.strptime(payload.subscription_end, "%Y-%m-%d")
        except Exception:
            pass
        
    db.commit()
    return {"message": "تم تحديث البيانات بنجاح"}

@router.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    """حذف العميل نهائياً من قاعدة البيانات."""
    u = db.query(User).filter(User.id == client_id, User.role == "user").first()
    if not u:
        raise HTTPException(status_code=404, detail="العميل مش موجود")
    db.delete(u)
    db.commit()
    return {"message": "تم حذف العميل بنجاح"}

class ManualFoodItem(BaseModel):
    food_id: int
    grams: int

class ManualAlternative(BaseModel):
    items: List[ManualFoodItem]

class ManualMeal(BaseModel):
    name: str
    alternatives: List[ManualAlternative]

class ManualPlanCreate(BaseModel):
    meals: List[ManualMeal]

@router.post("/plans/manual/{client_id}")
def create_manual_nutrition_plan(client_id: int, payload: ManualPlanCreate, db: Session = Depends(get_db)):
    """إنشاء نظام غذائي يدوياً من قبل الأدمن."""
    user = db.query(User).filter(User.id == client_id, User.role == "user").first()
    if not user:
        raise HTTPException(status_code=404, detail="العميل مش موجود")

    # حساب المجاميع
    total_calories = 0
    total_protein = 0.0
    total_carbs = 0.0
    total_fats = 0.0

    # تجهيز الوجبات بنفس صيغة AI
    meals_data = []

    for meal_input in payload.meals:
        meal_alts = []
        meal_calories = 0

        for alt_input in meal_input.alternatives:
            alt_items = []
            for item_input in alt_input.items:
                food_db = db.query(FoodItem).filter(FoodItem.id == item_input.food_id).first()
                if not food_db:
                    raise HTTPException(status_code=404, detail=f"صنف الطعام رقم {item_input.food_id} غير موجود")

                # حسابات (القيم في DB لكل 100 جرام)
                factor = item_input.grams / 100.0
                cals = food_db.calories * factor
                prot = food_db.protein * factor
                carb = food_db.carbs * factor
                fat = food_db.fats * factor

                # تجميع الماكروز الكلية بناءً على أول بديل (عادة هو الأساسي)
                if len(meal_alts) == 0:
                    total_calories += cals
                    total_protein += prot
                    total_carbs += carb
                    total_fats += fat
                    meal_calories += cals

                alt_items.append({
                    "food_id": food_db.id,
                    "food_name": food_db.name,
                    "quantity_grams": item_input.grams,
                    "calories": round(cals),
                    "protein": round(prot, 1),
                    "carbs": round(carb, 1),
                    "fats": round(fat, 1)
                })
            
            meal_alts.append({"items": alt_items})

        meals_data.append({
            "name": meal_input.name,
            "calories": round(meal_calories),
            "alternatives": meal_alts
        })

    # دائمًا نوقف القديم ونخلي الجديد هو الفعّال تلقائيا (Approved & Active)
    old_plans = db.query(NutritionPlan).filter(NutritionPlan.user_id == client_id).all()
    for op in old_plans:
        op.is_active = False

    new_plan = NutritionPlan(
        user_id=client_id,
        goal="نظام من الأدمن",
        daily_calories=round(total_calories),
        total_protein=round(total_protein, 1),
        total_carbs=round(total_carbs, 1),
        total_fats=round(total_fats, 1),
        admin_notes="تم إنشاء هذا النظام يدوياً من قبل الكابتن",
        status="approved",
        is_active=True
    )
    db.add(new_plan)
    db.flush()

    for m_data in meals_data:
        full_data = json.dumps({
            "meal_time": "",
            "meal_role": "",
            "alternatives": m_data["alternatives"]
        }, ensure_ascii=False)

        new_meal = Meal(
            plan_id=new_plan.id,
            name=m_data["name"],
            items=full_data,
            calories=m_data["calories"]
        )
        db.add(new_meal)

    db.commit()
    db.refresh(new_plan)

    return {"message": "تم إنشاء النظام الغذائي بنجاح!", "plan_id": new_plan.id}



# ── AI Nutrition Plans Management ──

@router.get("/plans/pending")
def get_pending_plans(db: Session = Depends(get_db)):
    """جلب كل الأنظمة الغذائية التي تنتظر الموافقة"""
    plans = db.query(NutritionPlan).filter(NutritionPlan.status == "pending").order_by(NutritionPlan.created_at.desc()).all()
    result = []
    for p in plans:
        result.append({
            "id": p.id,
            "client_name": p.user.full_name if p.user else "غير معروف",
            "client_id": p.user_id,
            "goal": p.goal,
            "daily_calories": p.daily_calories,
            "created_at": p.created_at.strftime("%Y-%m-%d %H:%M") if p.created_at else ""
        })
    return result

@router.get("/plans/{plan_id}")
def get_plan_details(plan_id: int, db: Session = Depends(get_db)):
    """جلب تفاصيل نظام غذائي معين (بما فيها الوجبات)"""
    plan = db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="النظام غير موجود")
    
    meals_data = []
    for m in plan.meals:
        meals_data.append({
            "id": m.id,
            "name": m.name,
            "items": m.items,
            "calories": m.calories
        })
        
    return {
        "id": plan.id,
        "client_name": plan.user.full_name if plan.user else "",
        "client_id": plan.user_id,
        "goal": plan.goal,
        "status": plan.status,
        # ── الماكروز (للأدمن فقط) ──
        "daily_calories": plan.daily_calories,
        "total_protein": plan.total_protein,
        "total_carbs": plan.total_carbs,
        "total_fats": plan.total_fats,
        "caloric_deficit": plan.caloric_deficit,
        "bmr_used": plan.bmr_used,
        "workout_day_calories": plan.workout_day_calories,
        "rest_day_calories": plan.rest_day_calories,
        "admin_notes": plan.admin_notes,
        "meals": meals_data
    }

@router.put("/plans/{plan_id}/approve")
def approve_plan(plan_id: int, db: Session = Depends(get_db)):
    """الموافقة على النظام الغذائي وجعله النشط للعميل"""
    plan = db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="النظام غير موجود")
    
    # Deactivate all other plans for this user
    db.query(NutritionPlan).filter(
        NutritionPlan.user_id == plan.user_id, 
        NutritionPlan.id != plan_id
    ).update({"is_active": False})
    
    # Approve and activate this one
    plan.status = "approved"
    plan.is_active = True
    db.commit()
    
    return {"message": "تم الموافقة على النظام الغذائي بنجاح وسيظهر للعميل الآن."}

@router.delete("/plans/{plan_id}")
def delete_plan(plan_id: int, db: Session = Depends(get_db)):
    """حذف النظام الغذائي (سواء كان مرفوض أو قديم)"""
    plan = db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="النظام غير موجود")
    
    db.delete(plan)
    db.commit()
    return {"message": "تم حذف النظام بنجاح"}


# ── Body Photos Upload (3 angles) ──

@router.post("/clients/{client_id}/body-photos")
async def upload_body_photos(
    client_id: int,
    front: UploadFile = File(None),
    back: UploadFile = File(None),
    side: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """رفع صور الجسم الثلاث (وش/ظهر/جنب) للعميل"""
    u = db.query(User).filter(User.id == client_id, User.role == "user").first()
    if not u:
        raise HTTPException(status_code=404, detail="العميل غير موجود")
    
    profile = db.query(ClientProfile).filter(ClientProfile.user_id == client_id).first()
    if not profile:
        profile = ClientProfile(user_id=client_id)
        db.add(profile)

    async def upload_photo(file: UploadFile, tag: str) -> str:
        contents = await file.read()
        res = cloudinary.uploader.upload(
            contents,
            folder=f"body_photos/{client_id}",
            public_id=f"{client_id}_{tag}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
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
        profile.body_photo_date = datetime.utcnow()

    db.commit()
    return {"status": "ok", "uploaded": uploaded, "photo_date": profile.body_photo_date.strftime("%Y-%m-%d") if profile.body_photo_date else ""}


@router.post("/clients/{client_id}/medication-photo")
async def upload_medication_photo(
    client_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """رفع صورة دواء للعميل وإضافتها للبيانات"""
    u = db.query(User).filter(User.id == client_id, User.role == "user").first()
    if not u:
        raise HTTPException(status_code=404, detail="العميل غير موجود")

    contents = await file.read()
    res = cloudinary.uploader.upload(
        contents,
        folder=f"medications/{client_id}",
        resource_type="image"
    )
    photo_url = res.get("secure_url", "")
    return {"status": "ok", "url": photo_url}


# ── Client Full Report ──

@router.get("/clients/{client_id}/report")
def get_client_report(client_id: int, db: Session = Depends(get_db)):
    """تقرير شامل للعميل قابل للطباعة"""
    u = db.query(User).filter(User.id == client_id, User.role == "user").first()
    if not u:
        raise HTTPException(status_code=404, detail="العميل غير موجود")

    p = u.profile

    # InBody readings
    from models.inbody import InBodyReading
    readings = db.query(InBodyReading).filter(
        InBodyReading.user_id == client_id
    ).order_by(InBodyReading.reading_date.desc()).all()

    # Active nutrition plan
    active_plan = db.query(NutritionPlan).filter(
        NutritionPlan.user_id == client_id,
        NutritionPlan.is_active == True
    ).first()

    meals_data = []
    if active_plan:
        for m in active_plan.meals:
            meals_data.append({"name": m.name, "items": m.items, "calories": m.calories})

    return {
        "report_date": datetime.utcnow().strftime("%Y-%m-%d"),
        "client": {
            "id": u.id,
            "full_name": u.full_name,
            "username": u.username,
            "phone": u.phone,
            "joined": u.created_at.strftime("%Y-%m-%d") if u.created_at else "",
            "is_active": u.is_active,
        },
        "body": {
            "weight": p.weight if p else None,
            "height": p.height if p else None,
            "age": p.age if p else None,
            "gender": p.gender if p else None,
            "body_fat": p.body_fat if p else None,
            "muscle_mass": p.muscle_mass if p else None,
        },
        "subscription": {
            "service_type": p.service_type if p else None,
            "type": p.subscription_type if p else None,
            "start": p.subscription_start.strftime("%Y-%m-%d") if p and p.subscription_start else None,
            "end": p.subscription_end.strftime("%Y-%m-%d") if p and p.subscription_end else None,
            "goal": p.goal if p else None,
        },
        "workout": {
            "is_active": p.is_active_workout if p else False,
            "days_per_week": p.workout_days_per_week if p else None,
            "type": p.workout_type if p else None,
            "schedule": p.workout_schedule if p else None,
            "sport_type": p.sport_type if p else None,
        },
        "health": {
            "has_injury": p.has_injury if p else False,
            "injury_details": p.injury_details if p else None,
            "takes_medication": p.takes_medication if p else False,
            "medication_details": p.medication_details if p else None,
            "has_health_issues": p.has_health_issues if p else False,
            "health_issues_details": p.health_issues_details if p else None,
            "notes": p.notes if p else None,
        },
        "body_photos": {
            "front": p.body_photo_front if p else None,
            "back": p.body_photo_back if p else None,
            "side": p.body_photo_side if p else None,
            "date": p.body_photo_date.strftime("%Y-%m-%d") if p and p.body_photo_date else None,
        },
        "inbody_readings": [
            {
                "date": r.reading_date.strftime("%Y-%m-%d") if r.reading_date else "",
                "weight": r.weight,
                "body_fat": r.body_fat,
                "muscle_mass": r.muscle_mass,
                "bmr": r.bmr,
                "score": r.score,
            } for r in readings
        ],
        "nutrition_plan": {
            "goal": active_plan.goal if active_plan else None,
            "daily_calories": active_plan.daily_calories if active_plan else None,
            "meals": meals_data,
        } if active_plan else None,
    }
