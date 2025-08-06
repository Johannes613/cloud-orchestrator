from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LogEntry(BaseModel):
    id: str
    level: str
    message: str
    source: str
    application_id: Optional[str] = None
    deployment_id: Optional[str] = None
    timestamp: datetime
    metadata: Optional[dict] = None

class LogEntryCreate(BaseModel):
    level: str
    message: str
    source: str
    application_id: Optional[str] = None
    deployment_id: Optional[str] = None
    metadata: Optional[dict] = None

class LogFilter(BaseModel):
    level: Optional[str] = None
    source: Optional[str] = None
    application_id: Optional[str] = None
    deployment_id: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    limit: Optional[int] = 100 