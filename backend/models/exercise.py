from datetime import datetime

from sqlalchemy import String, DateTime, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class Exercise(Base):
    """مكتبة التمارين — كل تمرين بالاسم والعضلة والـ GIF."""
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)               # "سكوات"
    muscle_group: Mapped[str] = mapped_column(String(50), nullable=False)        # "أرجل"
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    gif_url: Mapped[str | None] = mapped_column(String(500), nullable=True)      # لينك الـ GIF
    video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)    # لينك فيديو توضيحي
    difficulty: Mapped[str | None] = mapped_column(String(20), nullable=True)    # "مبتدئ" / "متوسط" / "متقدم"
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    workout_exercises: Mapped[list["WorkoutExercise"]] = relationship(back_populates="exercise", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Exercise {self.name} ({self.muscle_group})>"
