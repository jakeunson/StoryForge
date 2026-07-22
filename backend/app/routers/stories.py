from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/stories",
    tags=["Stories"]
)

@router.get("/", response_model=List[schemas.StoryResponse])
def get_stories(skip: int = 0, limit: int = 100, book_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Story)
    if book_id is not None:
        query = query.filter(models.Story.book_id == book_id)
    stories = query.order_by(models.Story.created_at.desc()).offset(skip).limit(limit).all()
    return stories

@router.get("/{story_id}", response_model=schemas.StoryResponse)
def get_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(models.Story).filter(models.Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story

from ..services.llm_service import generate_story_with_llm

@router.post("/", response_model=schemas.StoryResponse)
def create_story(story: schemas.StoryCreate, db: Session = Depends(get_db)):
    # If content is empty but prompt and llm_provider are provided, generate it
    content = story.content
    if not content and story.prompt and story.llm_provider and story.llm_provider != 'mock':
        settings = db.query(models.Setting).first()
        content = generate_story_with_llm(story.llm_provider, story.prompt, settings)

    story_data = story.model_dump()
    story_data['content'] = content

    db_story = models.Story(**story_data)
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

@router.put("/{story_id}", response_model=schemas.StoryResponse)
def update_story(story_id: int, story: schemas.StoryUpdate, db: Session = Depends(get_db)):
    db_story = db.query(models.Story).filter(models.Story.id == story_id).first()
    if not db_story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    update_data = story.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_story, key, value)
        
    db.commit()
    db.refresh(db_story)
    return db_story

@router.delete("/{story_id}")
def delete_story(story_id: int, db: Session = Depends(get_db)):
    db_story = db.query(models.Story).filter(models.Story.id == story_id).first()
    if not db_story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    db.delete(db_story)
    db.commit()
    return {"ok": True}
