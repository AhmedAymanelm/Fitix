from datetime import datetime

from sqlalchemy import String, Boolean, DateTime, func, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(10), nullable=False, default="user")  # "admin" or "user"
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    cv_access: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    profile: Mapped["ClientProfile | None"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    inbody_readings: Mapped[list["InBodyReading"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    workout_plans: Mapped[list["WorkoutPlan"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    nutrition_plans: Mapped[list["NutritionPlan"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    fitness_tests: Mapped[list["FitnessTest"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    sent_messages: Mapped[list["Message"]] = relationship(back_populates="sender", foreign_keys="Message.sender_id", cascade="all, delete-orphan")
    received_messages: Mapped[list["Message"]] = relationship(back_populates="receiver", foreign_keys="Message.receiver_id", cascade="all, delete-orphan")
    notifications: Mapped[list["Notification"]] = relationship(back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User {self.username} ({self.role})>"
