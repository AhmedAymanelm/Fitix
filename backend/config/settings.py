import os
from pathlib import Path
from dotenv import load_dotenv

# ── Paths ──
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DATABASE_DIR = BASE_DIR.parent / "database"
DATABASE_DIR.mkdir(exist_ok=True)

# ── Database ──
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{DATABASE_DIR / 'form_fitness.db'}"
)

# ── JWT ──
SECRET_KEY = os.getenv("SECRET_KEY", "form-fitness-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours

# ── CORS ──
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "")
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8080",
    "http://localhost:8000",
    "null",  # for file:// protocol (local development)
    # Production origins from env
    *[o.strip() for o in ALLOWED_ORIGINS.split(",") if o.strip()],
]
