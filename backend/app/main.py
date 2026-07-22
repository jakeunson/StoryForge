from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import characters, worldviews, stories, books, settings
from .auth import verify_password

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StoryForge API",
    description="Backend API for StoryForge AI Story Generator",
    version="1.0.0"
)

# CORS config for local frontend development (supports any localhost/127.0.0.1 port)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
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

@app.get("/")
def read_root():
    return {"message": "Welcome to StoryForge API"}
