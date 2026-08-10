from datetime import datetime

from sqlalchemy import String, Integer, DateTime, ForeignKey, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class NutritionPlan(Base):
    """النظام الغذائي — خطة التغذية لعميل معين."""
    __tablename__ = "nutrition_plans"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    goal: Mapped[str] = mapped_column(String(50), nullable=False)                # "تنشيف", "تضخيم"
    daily_calories: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending")           # "pending", "approved"
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)               # هل ده النظام الحالي؟
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user: Mapped["User"] = relationship(back_populates="nutrition_plans")
    meals: Mapped[list["Meal"]] = relationship(back_populates="plan", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<NutritionPlan {self.id} for User {self.user_id}>"


class Meal(Base):
    """وجبة واحدة داخل النظام الغذائي."""
    __tablename__ = "meals"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("nutrition_plans.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)               # "الفطار", "سناك 1"
    items: Mapped[str] = mapped_column(String(500), nullable=False)              # "4 بياض بيض + شوفان + موزة"
    calories: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    plan: Mapped["NutritionPlan"] = relationship(back_populates="meals")

    def __repr__(self) -> str:
        return f"<Meal {self.name} ({self.calories} cal)>"

class FoodItem(Base):
    """دليل الأغذية — السعرات والماكروز لكل 100 جرام."""
    __tablename__ = "food_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    calories: Mapped[float] = mapped_column(nullable=False)
    protein: Mapped[float] = mapped_column(nullable=False)
    carbs: Mapped[float] = mapped_column(nullable=False)
    fats: Mapped[float] = mapped_column(nullable=False)

    def __repr__(self) -> str:
        return f"<FoodItem {self.name} ({self.calories} kcal)>"
