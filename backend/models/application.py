from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class HealthStatus(BaseModel):
    status: str
    lastCheck: str
    responseTime: int
    uptime: int
    errorRate: float

class CPUMetrics(BaseModel):
    current: float
    limit: float
    unit: str

class MemoryMetrics(BaseModel):
    current: int
    limit: int
    unit: str

class NetworkMetrics(BaseModel):
    bytesIn: int
    bytesOut: int

class RequestMetrics(BaseModel):
    total: int
    perSecond: float
    errors: int

class Metrics(BaseModel):
    cpu: CPUMetrics
    memory: MemoryMetrics
    network: NetworkMetrics
    requests: RequestMetrics

class CPUResources(BaseModel):
    request: str
    limit: str

class MemoryResources(BaseModel):
    request: str
    limit: str

class StorageResources(BaseModel):
    size: str
    type: str

class Resources(BaseModel):
    cpu: CPUResources
    memory: MemoryResources
    storage: StorageResources

class Log(BaseModel):
    id: str
    timestamp: str
    level: str
    source: str
    message: str

class Vulnerability(BaseModel):
    id: str
    severity: str
    title: str
    description: str
    cve: str
    cvss: float
    package: str
    version: str
    fixedIn: str
    discovered: str
    status: str

class Application(BaseModel):
    id: str
    name: str
    description: str
    status: str
    replicas: int
    created: str
    updated: str
    namespace: str
    image: str
    version: str
    environment: str
    health: HealthStatus
    metrics: Metrics
    resources: Resources
    logs: List[Log]
    vulnerabilities: List[Vulnerability]
    tags: List[str]
    owner: str
    team: str

class ApplicationCreate(BaseModel):
    name: str
    description: str
    namespace: str
    image: str
    version: str
    environment: str
    replicas: int
    resources: Resources
    tags: List[str]
    owner: str
    team: str

class ApplicationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    replicas: Optional[int] = None
    version: Optional[str] = None
    environment: Optional[str] = None
    tags: Optional[List[str]] = None
    owner: Optional[str] = None
    team: Optional[str] = None 