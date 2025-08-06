from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Repository(BaseModel):
    id: str
    name: str
    url: str
    branch: str
    environment: str
    namespace: str
    path: str
    autoDeploy: bool
    syncInterval: int = 300
    deploymentCount: int = 0
    lastSync: Optional[datetime] = None
    status: str = "Active"
    created_at: datetime
    updated_at: datetime

class RepositoryCreate(BaseModel):
    name: str
    url: str
    branch: str
    environment: str
    namespace: str
    path: str
    autoDeploy: bool
    syncInterval: int = 300

class RepositoryUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    branch: Optional[str] = None
    environment: Optional[str] = None
    namespace: Optional[str] = None
    path: Optional[str] = None
    autoDeploy: Optional[bool] = None
    syncInterval: Optional[int] = None
    status: Optional[str] = None

class GitOpsDeployment(BaseModel):
    id: str
    repository_id: str
    commit_hash: str
    branch: str
    environment: str
    description: str
    triggered_by: str
    author: str
    status: str
    duration: Optional[int] = None
    created_at: datetime
    updated_at: datetime

class GitOpsDeploymentCreate(BaseModel):
    repository_id: str
    commit_hash: str
    branch: str
    environment: str
    description: str
    triggered_by: str
    author: str

class GitOpsDeploymentUpdate(BaseModel):
    commit_hash: Optional[str] = None
    branch: Optional[str] = None
    environment: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    duration: Optional[int] = None 