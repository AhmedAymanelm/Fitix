from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from config.settings import DATABASE_URL

# Support both SQLite (local) and PostgreSQL (Neon/Railway/production)
_url = DATABASE_URL

if _url.startswith("postgres://"):
    _url = _url.replace("postgres://", "postgresql://", 1)

if _url.startswith("postgresql"):
    engine = create_engine(
        _url,
        echo=False,
        pool_pre_ping=True,       # reconnect on stale connections
        pool_size=5,
        max_overflow=10,
    )
else:
    engine = create_engine(
        _url,
        connect_args={"check_same_thread": False},
        echo=False,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency — yields a DB session and closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
