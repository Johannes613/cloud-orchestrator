from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class LogEntryCreate(BaseModel):
    level: str  # 'info', 'warning', 'error', 'debug'
    message: str
    source: str  # 'application', 'system', 'deployment'
    details: Optional[Dict[str, Any]] = None
    application_id: Optional[str] = None
    deployment_id: Optional[str] = None

class LogEntry(BaseModel):
    id: str
    timestamp: str
    level: str
    message: str
    source: str
    details: Optional[Dict[str, Any]] = None
    application_id: Optional[str] = None
    deployment_id: Optional[str] = None

class LogFilter(BaseModel):
    level: Optional[str] = None
    source: Optional[str] = None
    application_id: Optional[str] = None
    deployment_id: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    limit: Optional[int] = 100 