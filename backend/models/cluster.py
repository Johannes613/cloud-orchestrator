from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ClusterCreate(BaseModel):
    name: str
    provider: str  # 'aws', 'gcp', 'azure', 'on-premise'
    region: str
    version: str
    description: Optional[str] = ""
    environment: str  # 'dev', 'staging', 'production'

class ClusterUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    version: Optional[str] = None

class ClusterMetrics(BaseModel):
    cpu_usage: float
    memory_usage: float
    node_count: int
    pod_count: int
    namespace_count: int

class Cluster(BaseModel):
    id: str
    name: str
    provider: str
    region: str
    version: str
    status: str  # 'Active' | 'Inactive' | 'Error' | 'Maintenance'
    description: str
    environment: str
    created: str
    updated: str
    last_health_check: str
    metrics: Optional[ClusterMetrics] = None
    node_count: int = 0
    pod_count: int = 0
    namespace_count: int = 0 