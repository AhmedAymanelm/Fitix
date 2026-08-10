from datetime import datetime

from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, func, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class ClientProfile(Base):
    """بروفايل العميل — بيانات إضافية زي الوزن والهدف والاشتراك."""
    __tablename__ = "client_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)

    # Body data
    weight: Mapped[float | None] = mapped_column(Float, nullable=True)           # كجم
    height: Mapped[float | None] = mapped_column(Float, nullable=True)           # سم
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)              # سنة
    body_fat: Mapped[float | None] = mapped_column(Float, nullable=True)         # نسبة الدهون %
    muscle_mass: Mapped[float | None] = mapped_column(Float, nullable=True)      # الكتلة العضلية كجم
    gender: Mapped[str | None] = mapped_column(String(10), nullable=True)        # "ذكر" / "أنثى"

    # Goal & subscription
    goal: Mapped[str | None] = mapped_column(String(30), nullable=True)          # "تنشيف" / "تضخيم" / "لياقة"
    subscription_type: Mapped[str | None] = mapped_column(String(30), nullable=True)  # "شهري" / "ربع سنوي" / "سنوي"
    subscription_start: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    subscription_end: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    service_type: Mapped[str | None] = mapped_column(String(30), nullable=True)  # "nutrition" / "nutrition_fitness" / "gym_workout"
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Workout info — معلومات التمرين
    is_active_workout: Mapped[bool | None] = mapped_column(Boolean, nullable=True, default=False)  # هل بيتمرن؟
    workout_days_per_week: Mapped[int | None] = mapped_column(Integer, nullable=True)               # كام يوم في الأسبوع
    workout_type: Mapped[str | None] = mapped_column(String(50), nullable=True)                     # "أثقال" / "كارديو" / "مختلط" / "يوجا"
    workout_schedule: Mapped[str | None] = mapped_column(Text, nullable=True)                       # JSON: مواعيد التمرين
    sport_type: Mapped[str | None] = mapped_column(String(100), nullable=True)                      # نوع الرياضة تفصيليًا

    # Health & Medical — الحالة الصحية
    has_injury: Mapped[bool | None] = mapped_column(Boolean, nullable=True, default=False)
    injury_details: Mapped[str | None] = mapped_column(Text, nullable=True)     # JSON: [{type, date, recovered, notes}]
    takes_medication: Mapped[bool | None] = mapped_column(Boolean, nullable=True, default=False)
    medication_details: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON: [{name, dose, frequency, photo_url}]
    has_health_issues: Mapped[bool | None] = mapped_column(Boolean, nullable=True, default=False)
    health_issues_details: Mapped[str | None] = mapped_column(Text, nullable=True)  # وصف المشاكل الصحية

    # Body progress photos — صور التقدم
    body_photo_front: Mapped[str | None] = mapped_column(String(500), nullable=True)   # رابط صورة الوش
    body_photo_back: Mapped[str | None] = mapped_column(String(500), nullable=True)    # رابط صورة الظهر
    body_photo_side: Mapped[str | None] = mapped_column(String(500), nullable=True)    # رابط صورة الجنب
    body_photo_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)  # تاريخ رفع الصور

    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user: Mapped["User"] = relationship(back_populates="profile")

    def __repr__(self) -> str:
        return f"<ClientProfile user_id={self.user_id} weight={self.weight}>"
