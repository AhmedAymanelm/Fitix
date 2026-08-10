from datetime import datetime

from sqlalchemy import String, Integer, DateTime, ForeignKey, func, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class WorkoutPlan(Base):
    """خطة التمارين — يوم تمرين لعميل معين."""
    __tablename__ = "workout_plans"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)               # مثلا "أرجل", "بوش"
    day_of_week: Mapped[str | None] = mapped_column(String(20), nullable=True)   # "السبت", "الأحد"
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)           # هل خلص تمرين اليوم؟
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user: Mapped["User"] = relationship(back_populates="workout_plans")
    exercises: Mapped[list["WorkoutExercise"]] = relationship(
        back_populates="plan", cascade="all, delete-orphan", order_by="WorkoutExercise.order"
    )

    def __repr__(self) -> str:
        return f"<WorkoutPlan {self.name} for User {self.user_id}>"


class WorkoutExercise(Base):
    """تمرين معين داخل خطة التمارين مع عدد المجموعات والعدات."""
    __tablename__ = "workout_exercises"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("workout_plans.id", ondelete="CASCADE"), index=True)
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id", ondelete="RESTRICT"))
    
    order: Mapped[int] = mapped_column(Integer, default=1)                       # ترتيب التمرين في اليوم
    sets: Mapped[int] = mapped_column(Integer, nullable=False, default=3)
    reps: Mapped[int] = mapped_column(Integer, nullable=False, default=12)
    rest_seconds: Mapped[int] = mapped_column(Integer, nullable=False, default=60)
    weight: Mapped[str | None] = mapped_column(String(50), nullable=True)        # الوزن، مثلا "10" أو "-"
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    plan: Mapped["WorkoutPlan"] = relationship(back_populates="exercises")
    exercise: Mapped["Exercise"] = relationship(back_populates="workout_exercises")

    def __repr__(self) -> str:
        return f"<WorkoutExercise plan={self.plan_id} exercise={self.exercise_id}>"

class WorkoutLog(Base):
    """سجل أداء التدريبات — يسجل ما تم إنجازه أو إلغاؤه في اليوم."""
    __tablename__ = "workout_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("workout_plans.id", ondelete="CASCADE"), index=True)
    
    is_completed: Mapped[bool] = mapped_column(Boolean, default=True)            # True إذا أكمل التدريب، False إذا أوقفه مبكراً
    session_data: Mapped[str] = mapped_column(Text)                              # بيانات JSON تحتوي على المجموعات المكتملة
    
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    user: Mapped["User"] = relationship()
    plan: Mapped["WorkoutPlan"] = relationship()

    def __repr__(self) -> str:
        return f"<WorkoutLog user={self.user_id} plan={self.plan_id} completed={self.is_completed}>"
