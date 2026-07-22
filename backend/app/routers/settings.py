from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/settings",
    tags=["Settings"]
)

@router.get("/", response_model=schemas.SettingResponse)
def get_settings(db: Session = Depends(get_db)):
    db_setting = db.query(models.Setting).first()
    if not db_setting:
        # Create default settings if not exists
        db_setting = models.Setting()
        db.add(db_setting)
        db.commit()
        db.refresh(db_setting)
    return db_setting

@router.put("/", response_model=schemas.SettingResponse)
def update_settings(settings: schemas.SettingUpdate, db: Session = Depends(get_db)):
    db_setting = db.query(models.Setting).first()
    if not db_setting:
        db_setting = models.Setting()
        db.add(db_setting)
        
    update_data = settings.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_setting, key, value)
        
    db.commit()
    db.refresh(db_setting)
    return db_setting
