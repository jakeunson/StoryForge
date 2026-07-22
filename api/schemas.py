from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Character Schemas ---

class CharacterBase(BaseModel):
    name: str
    nickname: Optional[str] = ""
    role: Optional[str] = ""
    main_objective: Optional[str] = ""
    fatal_flaw: Optional[str] = ""
    constraints: Optional[str] = ""
    appearance_and_skills: Optional[str] = ""
    relationships: Optional[List[Dict[str, Any]]] = []

class CharacterCreate(CharacterBase):
    pass

class CharacterUpdate(CharacterBase):
    pass

class CharacterResponse(CharacterBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Worldview Schemas ---

class WorldviewBase(BaseModel):
    name: str
    core_theme: Optional[str] = ""
    system_and_laws: Optional[str] = ""
    absolute_rules: Optional[str] = ""
    social_conflicts: Optional[str] = ""
    key_locations: Optional[List[Dict[str, Any]]] = []

class WorldviewCreate(WorldviewBase):
    pass

class WorldviewUpdate(WorldviewBase):
    pass

class WorldviewResponse(WorldviewBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Book Schemas ---

class BookBase(BaseModel):
    title: str
    description: Optional[str] = ""

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    pass

class BookResponse(BookBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Setting Schemas ---

class SettingBase(BaseModel):
    theme: Optional[str] = "dark"
    gemini_api_key: Optional[str] = None
    groq_api_key: Optional[str] = None
    cohere_api_key: Optional[str] = None

class SettingUpdate(SettingBase):
    pass

class SettingResponse(SettingBase):
    id: int
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# --- Story Schemas ---

class StoryBase(BaseModel):
    title: str
    book_id: Optional[int] = None
    prompt: Optional[str] = ""
    content: Optional[str] = ""
    character_ids: Optional[List[int]] = []
    worldview_id: Optional[int] = None
    genre: Optional[str] = ""
    format_type: Optional[str] = ""
    llm_provider: Optional[str] = ""

class StoryCreate(StoryBase):
    pass

class StoryUpdate(StoryBase):
    pass

class StoryResponse(StoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
