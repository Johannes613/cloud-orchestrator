from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class RepositoryCreate(BaseModel):
    name: str
    url: str
    branch: str
    environment: str
    namespace: str
    path: str
    autoDeploy: bool = False
    syncInterval: int = 300  # 5 minutes default

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

class Repository(BaseModel):
    id: str
    name: str
    url: str
    branch: str
    autoDeploy: bool
    status: str  # 'Active' | 'Inactive' | 'Error' | 'Syncing'
    lastDeployed: str
    environment: str
    namespace: str
    path: str
    syncInterval: int
    lastSync: str
    commitCount: int
    deploymentCount: int

class GitOpsDeploymentCreate(BaseModel):
    repository_id: str
    commit_hash: str
    branch: str
    environment: str
    description: Optional[str] = ""
    triggered_by: Optional[str] = "admin@company.com"

class GitOpsDeploymentUpdate(BaseModel):
    status: Optional[str] = None
    description: Optional[str] = None
    commit_hash: Optional[str] = None

class GitOpsDeployment(BaseModel):
    id: str
    repository_id: str
    commit_hash: str
    branch: str
    environment: str
    status: str  # 'Pending' | 'Deploying' | 'Success' | 'Failed'
    description: str
    triggered_by: str
    created: str
    updated: str
    deployed_at: Optional[str] = None
    duration: int = 0
    logs_url: str
    repository: Optional[Repository] = None 