from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class DeploymentResources(BaseModel):
    cpu: Dict[str, str]
    memory: Dict[str, str]

class DeploymentCreate(BaseModel):
    application_id: str
    version: str
    environment: str
    commit_hash: str
    description: Optional[str] = ""
    triggered_by: Optional[str] = "admin@company.com"
    deployment_strategy: Optional[str] = "rolling"
    replicas: Optional[int] = 1
    resources: Optional[DeploymentResources] = None

class DeploymentUpdate(BaseModel):
    version: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    deployment_strategy: Optional[str] = None
    replicas: Optional[int] = None
    resources: Optional[DeploymentResources] = None

class Deployment(BaseModel):
    id: str
    application_id: str
    version: str
    status: str
    commit_hash: str
    environment: str
    deployed_at: str
    logs_url: str
    duration: int
    created: str
    updated: str
    description: str
    triggered_by: str
    rollback_version: str
    deployment_strategy: str
    replicas: int
    resources: DeploymentResources
    application: Optional[Dict[str, Any]] = None 