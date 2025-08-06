from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Cluster(BaseModel):
    id: str
    name: str
    provider: str
    region: str
    environment: str
    version: str
    node_count: int
    deployment_count: int = 0
    status: str = "Active"
    created_at: datetime
    updated_at: datetime

class ClusterCreate(BaseModel):
    name: str
    provider: str
    region: str
    environment: str
    version: str
    node_count: int

class ClusterUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    region: Optional[str] = None
    environment: Optional[str] = None
    version: Optional[str] = None
    node_count: Optional[int] = None
    status: Optional[str] = None

class ClusterMetrics(BaseModel):
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    network_io: float
    pod_count: int
    node_count: int
    deployment_count: int 