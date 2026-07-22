from fastapi import Header, HTTPException, Depends
from .config import settings

def verify_password(x_auth_token: str = Header(None)):
    if settings.MASTER_PASSWORD and x_auth_token != settings.MASTER_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid Master Password")
    return True
