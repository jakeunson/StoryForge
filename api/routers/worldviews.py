from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/worldviews",
    tags=["Worldviews"]
)

@router.get("/", response_model=List[schemas.WorldviewResponse])
def get_worldviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    worldviews = db.query(models.Worldview).offset(skip).limit(limit).all()
    return worldviews

@router.get("/{worldview_id}", response_model=schemas.WorldviewResponse)
def get_worldview(worldview_id: int, db: Session = Depends(get_db)):
    worldview = db.query(models.Worldview).filter(models.Worldview.id == worldview_id).first()
    if not worldview:
        raise HTTPException(status_code=404, detail="Worldview not found")
    return worldview

@router.post("/", response_model=schemas.WorldviewResponse)
def create_worldview(worldview: schemas.WorldviewCreate, db: Session = Depends(get_db)):
    db_worldview = models.Worldview(**worldview.model_dump())
    db.add(db_worldview)
    db.commit()
    db.refresh(db_worldview)
    return db_worldview

@router.put("/{worldview_id}", response_model=schemas.WorldviewResponse)
def update_worldview(worldview_id: int, worldview: schemas.WorldviewUpdate, db: Session = Depends(get_db)):
    db_worldview = db.query(models.Worldview).filter(models.Worldview.id == worldview_id).first()
    if not db_worldview:
        raise HTTPException(status_code=404, detail="Worldview not found")
    
    update_data = worldview.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_worldview, key, value)
        
    db.commit()
    db.refresh(db_worldview)
    return db_worldview

@router.delete("/{worldview_id}")
def delete_worldview(worldview_id: int, db: Session = Depends(get_db)):
    db_worldview = db.query(models.Worldview).filter(models.Worldview.id == worldview_id).first()
    if not db_worldview:
        raise HTTPException(status_code=404, detail="Worldview not found")
    
    db.delete(db_worldview)
    db.commit()
    return {"ok": True}
