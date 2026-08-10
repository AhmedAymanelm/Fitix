from config.database import SessionLocal
from models.user import User

db = SessionLocal()

print("Deleting all users except admin...")
db.query(User).filter(User.role == "user").delete()
db.commit()

print("Database cleaned successfully!")
