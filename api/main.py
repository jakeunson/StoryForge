from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
import logging
from .database import engine, Base
from .routers import characters, worldviews, stories, books, settings
from .auth import verify_password

logger = logging.getLogger(__name__)

# Try to create tables, but don't crash the serverless function if DB is temporarily unreachable
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    logger.error(f"Failed to initialize database tables: {e}")

app = FastAPI(
    title="StoryForge API",
    description="Backend API for StoryForge AI Story Generator",
    version="1.0.0"
)

# CORS config for local frontend development and Vercel cloud deployment
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(characters.router, dependencies=[Depends(verify_password)])
app.include_router(worldviews.router, dependencies=[Depends(verify_password)])
app.include_router(stories.router, dependencies=[Depends(verify_password)])
app.include_router(books.router, dependencies=[Depends(verify_password)])
app.include_router(settings.router, dependencies=[Depends(verify_password)])

@app.post("/api/auth")
def verify_auth_token(depends: bool = Depends(verify_password)):
    return {"ok": True}

@app.get("/api/health")
def read_root():
    return {"message": "Welcome to StoryForge API", "status": "healthy"}
