"""
API الإشعارات — تذكيرات المواعيد وانتهاء الاشتراك والعملاء الجدد
"""
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional

from config.database import get_db
from models.user import User
from models.notification import Notification, NotificationSettings
from models.client_profile import ClientProfile
from api.deps import get_current_user, get_current_admin

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


# ── Schemas ──
class NotificationSettingsUpdate(BaseModel):
    appointment_reminder_days: Optional[int] = None
    subscription_reminder_days: Optional[int] = None


# ── Helper: إنشاء إشعار ──
def create_notification(db: Session, user_id: int, type: str, title: str, message: str,
                        scheduled_for: datetime = None):
    notif = Notification(
        user_id=user_id,
        type=type,
        title=title,
        message=message,
        scheduled_for=scheduled_for,
        sent_at=datetime.utcnow()
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


# ── GET: جلب إشعارات اليوزر الحالي ──
@router.get("")
def get_my_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifs = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).limit(50).all()

    return [
        {
            "id": n.id,
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at.strftime("%Y-%m-%d %H:%M") if n.created_at else "",
        }
        for n in notifs
    ]


# ── GET: عدد الإشعارات غير المقروءة ──
@router.get("/unread-count")
def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    return {"count": count}


# ── POST: تعليم كل الإشعارات كمقروءة ──
@router.post("/mark-all-read")
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"status": "ok"}


# ── POST: تعليم إشعار واحد كمقروء ──
@router.post("/{notif_id}/mark-read")
def mark_one_read(
    notif_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notif = db.query(Notification).filter(
        Notification.id == notif_id,
        Notification.user_id == current_user.id
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "ok"}


# ── GET: إعدادات الإشعارات (للأدمن) ──
@router.get("/settings", dependencies=[Depends(get_current_admin)])
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(NotificationSettings).first()
    if not settings:
        settings = NotificationSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return {
        "appointment_reminder_days": settings.appointment_reminder_days,
        "subscription_reminder_days": settings.subscription_reminder_days,
    }


# ── PUT: تحديث إعدادات الإشعارات (للأدمن فقط) ──
@router.put("/settings", dependencies=[Depends(get_current_admin)])
def update_settings(payload: NotificationSettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(NotificationSettings).first()
    if not settings:
        settings = NotificationSettings()
        db.add(settings)

    if payload.appointment_reminder_days is not None:
        settings.appointment_reminder_days = payload.appointment_reminder_days
    if payload.subscription_reminder_days is not None:
        settings.subscription_reminder_days = payload.subscription_reminder_days

    db.commit()
    return {"status": "ok", "message": "تم تحديث إعدادات الإشعارات"}


def run_daily_notification_check_logic(db: Session):
    settings = db.query(NotificationSettings).first()
    appt_days = settings.appointment_reminder_days if settings else 1
    sub_days = settings.subscription_reminder_days if settings else 3

    now = datetime.utcnow()
    created = 0

    # ── فحص انتهاء الاشتراكات ──
    clients = db.query(User).filter(User.role == "user", User.is_active == True).all()
    for client in clients:
        if not client.profile or not client.profile.subscription_end:
            continue

        sub_end = client.profile.subscription_end
        days_remaining = (sub_end - now).days

        if 0 <= days_remaining <= sub_days:
            # تحقق إنه ما اتبعتش إشعار مماثل النهارده
            existing = db.query(Notification).filter(
                Notification.user_id == client.id,
                Notification.type == "subscription_expiry",
                Notification.created_at >= now.replace(hour=0, minute=0, second=0)
            ).first()
            if not existing:
                end_str = sub_end.strftime("%Y-%m-%d")
                create_notification(
                    db, client.id,
                    "subscription_expiry",
                    "⏰ اشتراكك قرب ينتهي",
                    f"نذكرك أن مدة اشتراكك هتنتهي يوم {end_str}. يسعدنا أن تكون معانا مرة تانية! 💪"
                )
                admin = db.query(User).filter(User.role == "admin").first()
                if admin:
                    create_notification(
                        db, admin.id,
                        "subscription_expiry",
                        f"⏰ اشتراك {client.full_name} قرب ينتهي",
                        f"اشتراك العميل {client.full_name} هينتهي يوم {end_str} ({days_remaining} يوم متبقي)"
                    )
                created += 2

    return created

# ── POST: فحص وإرسال إشعارات المواعيد والاشتراكات (يُستدعى يوميًا) ──
@router.post("/run-daily-check", dependencies=[Depends(get_current_admin)])
def run_daily_notification_check(db: Session = Depends(get_db)):
    """
    يفحص المواعيد القادمة وتجديد الاشتراكات ويُنشئ إشعارات.
    يُستدعى من Admin يدويًا أو من scheduler خارجي.
    """
    created = run_daily_notification_check_logic(db)
    return {"status": "ok", "notifications_created": created}


# ── POST: إشعار عميل جديد للأدمن ──
def notify_admin_new_client(db: Session, client_name: str, client_id: int):
    """يُستدعى عند إنشاء عميل جديد."""
    admin = db.query(User).filter(User.role == "admin").first()
    if admin:
        create_notification(
            db, admin.id,
            "new_client",
            "🎉 عميل جديد انضم!",
            f"العميل {client_name} انضم للنظام للتو. اضغط لعرض بياناته."
        )


class AppointmentReminderRequest(BaseModel):
    client_id: int
    appointment_date: str
    note: Optional[str] = ""


# ── POST: إشعار تذكير موعد ──
@router.post("/send-appointment-reminder", dependencies=[Depends(get_current_admin)])
def send_appointment_reminder(data: AppointmentReminderRequest, db: Session = Depends(get_db)):
    """إرسال تذكير موعد يدوي لعميل."""
    client = db.query(User).filter(User.id == data.client_id, User.role == "user").first()
    if not client:
        return {"error": "العميل غير موجود"}

    # إشعار للعميل
    create_notification(
        db, client.id,
        "appointment_reminder",
        "📅 تذكير بموعدك",
        f"نذكرك بموعدك بكره {data.appointment_date}. {data.note} 💪"
    )

    # إشعار للأدمن
    admin = db.query(User).filter(User.role == "admin").first()
    if admin:
        create_notification(
            db, admin.id,
            "appointment_reminder",
            f"📅 موعد {client.full_name} بكره",
            f"العميل {client.full_name} عنده موعد يوم {data.appointment_date}. {data.note}"
        )

    return {"status": "ok", "message": f"تم إرسال تذكير الموعد للعميل {client.full_name}"}
