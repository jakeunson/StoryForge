from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./storyforge.db"
    MASTER_PASSWORD: str = "0000" # Default password for local testing
    
    class Config:
        env_file = ".env"

settings = Settings()
