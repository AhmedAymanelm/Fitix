from datetime import datetime

from sqlalchemy import String, Integer, DateTime, ForeignKey, func, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class Notification(Base):
    """الإشعارات — تذكيرات المواعيد وانتهاء الاشتراك والعملاء الجدد."""
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    # نوع الإشعار
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    # "appointment_reminder" — تذكير موعد
    # "subscription_expiry" — انتهاء اشتراك
    # "new_client"          — عميل جديد
    # "general"             — عام

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)

    # متى يُرسَل (للمجدولة)
    scheduled_for: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # علاقة
    user: Mapped["User"] = relationship(back_populates="notifications")

    def __repr__(self) -> str:
        return f"<Notification {self.type} for user {self.user_id}>"


class NotificationSettings(Base):
    """إعدادات الإشعارات — يحددها الأدمن."""
    __tablename__ = "notification_settings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    appointment_reminder_days: Mapped[int] = mapped_column(Integer, default=1)   # كام يوم قبل الموعد
    subscription_reminder_days: Mapped[int] = mapped_column(Integer, default=3)  # كام يوم قبل انتهاء الاشتراك
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    def __repr__(self) -> str:
        return f"<NotificationSettings appt={self.appointment_reminder_days}d sub={self.subscription_reminder_days}d>"


class GymSettings(Base):
    """إعدادات الجيم — الاسم واللون واللوجو."""
    __tablename__ = "gym_settings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    gym_name: Mapped[str] = mapped_column(String(100), default="FORM Fitness")
    primary_color: Mapped[str] = mapped_column(String(20), default="#c8ff3d")
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    def __repr__(self) -> str:
        return f"<GymSettings name={self.gym_name}>"
