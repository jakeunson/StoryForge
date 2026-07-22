from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

db_url = settings.DATABASE_URL

# Supabase uses postgres:// — convert to postgresql+pg8000:// for SQLAlchemy + pg8000 driver
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+pg8000://", 1)
elif db_url.startswith("postgresql://") and "+pg8000" not in db_url:
    db_url = db_url.replace("postgresql://", "postgresql+pg8000://", 1)

# SQLite requires check_same_thread; Postgres does not
connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine = create_engine(db_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
