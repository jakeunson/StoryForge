from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    theme = Column(String, default="dark")
    gemini_api_key = Column(String, nullable=True)
    groq_api_key = Column(String, nullable=True)
    cohere_api_key = Column(String, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    nickname = Column(Text, default="")
    role = Column(Text, default="")
    main_objective = Column(Text, default="")
    fatal_flaw = Column(Text, default="")
    constraints = Column(Text, default="")
    appearance_and_skills = Column(Text, default="")
    relationships = Column(JSON, default=list)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Worldview(Base):
    __tablename__ = "worldviews"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    core_theme = Column(Text, default="")
    system_and_laws = Column(Text, default="")
    absolute_rules = Column(Text, default="")
    social_conflicts = Column(Text, default="")
    key_locations = Column(JSON, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(Text, nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=True)
    prompt = Column(Text, default="")
    content = Column(Text, default="")
    character_ids = Column(JSON, default=list)
    worldview_id = Column(Integer, ForeignKey("worldviews.id"), nullable=True)
    genre = Column(Text, default="")
    format_type = Column(Text, default="")
    llm_provider = Column(Text, default="")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
