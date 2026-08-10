from pydantic import BaseModel, Field
from typing import List, Optional


class MealItem(BaseModel):
    food_name: str = Field(description="اسم الصنف من قاعدة البيانات بالظبط")
    quantity_grams: int = Field(description="الكمية بالجرام")
    calories: float = Field(description="السعرات الحرارية لهذه الكمية")
    protein: float = Field(description="البروتين بالجرام لهذه الكمية")
    carbs: float = Field(description="الكربوهيدرات بالجرام لهذه الكمية")
    fats: float = Field(description="الدهون بالجرام لهذه الكمية")


class MealAlternative(BaseModel):
    """بديل واحد من وجبة — نفس الوجبة بتركيبة مختلفة"""
    alternative_label: str = Field(description="مثال: خيار 1، خيار 2، خيار 3")
    items: List[MealItem] = Field(description="الأصناف في هذا الخيار البديل")
    total_calories: int = Field(description="إجمالي سعرات الخيار البديل")
    total_protein: float = Field(description="إجمالي البروتين بالجرام")
    total_carbs: float = Field(description="إجمالي الكربوهيدرات بالجرام")
    total_fats: float = Field(description="إجمالي الدهون بالجرام")


class MealPlan(BaseModel):
    meal_name: str = Field(description="اسم الوجبة مثل: الفطار، سناك ما قبل التمرين، الغداء، سناك ما بعد التمرين، العشاء")
    meal_time: str = Field(description="الوقت المقترح للوجبة مثل: 7:00 ص، 10:00 ص")
    meal_role: str = Field(description="دور الوجبة: فطار | سناك | غداء | عشاء | ما قبل التمرين | ما بعد التمرين")
    alternatives: List[MealAlternative] = Field(
        description="3 إلى 4 خيارات بديلة لهذه الوجبة. العميل يختار الخيار اللي يناسبه"
    )
    total_calories: int = Field(description="متوسط سعرات الوجبة (بناءً على الخيار الأول)")


class NutritionPlanOutput(BaseModel):
    # ── الأرقام الأساسية (للأدمن فقط — لا تعرضها للعميل) ──
    bmr: int = Field(description="معدل الحرق الأساسي المستخدم في الحساب (BMR)")
    daily_calories: int = Field(description="إجمالي السعرات اليومية المستهدفة")
    workout_day_calories: int = Field(description="سعرات يوم التمرين (أعلى من يوم الراحة)")
    rest_day_calories: int = Field(description="سعرات يوم الراحة (أقل من يوم التمرين)")
    caloric_deficit: int = Field(
        description="العجز أو الزيادة في السعرات (موجب = عجز/حرق دهون، سالب = زيادة/تضخيم). مثال: 400 يعني العميل بياكل 400 سعرة أقل من الـ BMR"
    )
    total_protein: int = Field(description="إجمالي البروتين اليومي المستهدف بالجرام")
    total_carbs: int = Field(description="إجمالي الكربوهيدرات اليومية المستهدفة بالجرام")
    total_fats: int = Field(description="إجمالي الدهون اليومية المستهدفة بالجرام")

    # ── الوجبات ──
    meals: List[MealPlan] = Field(description="قائمة الوجبات (5 وجبات) — كل وجبة فيها 3-4 خيارات بديلة")

    # ── ملاحظات للأدمن فقط ──
    admin_notes: str = Field(
        description="ملاحظات فنية للمدرب: كيف تم حساب السعرات، المعادلات المستخدمة، نصائح للمتابعة — بالعربي"
    )

    # ── ملاحظات للعميل ──
    client_notes: str = Field(description="نصائح وتوجيهات للعميل بالعربي المصري البسيط — بدون أرقام ماكروز")
    workout_nutrition_notes: str = Field(
        description="إرشادات التغذية المرتبطة بالتمرين للعميل: ماذا يأكل قبل وبعد التمرين"
    )
