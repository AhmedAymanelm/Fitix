from config.database import engine, SessionLocal, Base
from models.user import User
from models.client_profile import ClientProfile
from api.deps import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Check if admin exists
admin = db.query(User).filter(User.username == "admin").first()
if not admin:
    print("Creating admin user...")
    admin = User(
        username="admin",
        full_name="الكابتن (أدمن)",
        phone="01000000000",
        role="admin",
        hashed_password=hash_password("Fx1234!")
    )
    db.add(admin)

# Check if omar exists
omar = db.query(User).filter(User.username == "omar.fit").first()
if not omar:
    print("Creating omar.fit user...")
    omar = User(
        username="omar.fit",
        full_name="عمر حسن",
        phone="01111111111",
        role="user",
        hashed_password=hash_password("Fx1234!")
    )
    db.add(omar)
    db.commit()
    db.refresh(omar)
    
    # create profile
    profile = ClientProfile(
        user_id=omar.id,
        weight=82.0,
        height=175.0,
        body_fat=18.0,
        muscle_mass=42.1,
        subscription_type="شهري"
    )
    db.add(profile)

# Seed Exercises
from models.exercise import Exercise
ex_count = db.query(Exercise).count()
if ex_count == 0:
    print("Creating exercises...")
    exercises = [
        Exercise(name="سكوات", muscle_group="أرجل", difficulty="متوسط"),
        Exercise(name="بنش برس", muscle_group="صدر", difficulty="متوسط"),
        Exercise(name="ديدليفت", muscle_group="ظهر", difficulty="متقدم"),
        Exercise(name="بايسبس كيرل", muscle_group="ذراعين", difficulty="مبتدئ"),
        Exercise(name="شولدر برس", muscle_group="أكتاف", difficulty="متوسط"),
        Exercise(name="بلانك", muscle_group="بطن", difficulty="مبتدئ"),
        Exercise(name="لانجز", muscle_group="أرجل", difficulty="متوسط"),
        Exercise(name="لات بول داون", muscle_group="ظهر", difficulty="مبتدئ"),
    ]
    db.add_all(exercises)

db.commit()
print("Database seeded successfully!")
