from datetime import datetime
from sqlalchemy import String, DateTime, Integer, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from config.database import Base


class ExerciseCategory(Base):
    """أقسام التمارين — الأدمن ينشئ أقسام زي صدر/ظهر/أرجل..."""
    __tablename__ = "exercise_categories"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)        # اسم القسم
    description: Mapped[str | None] = mapped_column(Text, nullable=True)  # وصف اختياري
    icon: Mapped[str | None] = mapped_column(String(10), nullable=True)   # إيموجي اختياري
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # الـ exercises المرتبطة بالقسم دا
    items: Mapped[list["CategoryExercise"]] = relationship(
        back_populates="category", cascade="all, delete-orphan", order_by="CategoryExercise.sort_order"
    )


class CategoryExercise(Base):
    """تمرين داخل قسم معين."""
    __tablename__ = "category_exercises"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("exercise_categories.id", ondelete="CASCADE"))
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id", ondelete="CASCADE"))
    sets: Mapped[int | None] = mapped_column(Integer, nullable=True)        # عدد السيتات
    reps: Mapped[str | None] = mapped_column(String(30), nullable=True)     # مثلاً "8-12" أو "15"
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    category: Mapped["ExerciseCategory"] = relationship(back_populates="items")
    exercise: Mapped["Exercise"] = relationship()
