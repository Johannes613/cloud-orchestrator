from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import json
import os
from models.application import Application, ApplicationCreate, ApplicationUpdate

class ApplicationService:
    def __init__(self):
        self.applications = {}
        self.data_file = "data/applications.json"
        self._load_data()

    def _load_data(self):
        """Load applications from JSON file"""
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    # Handle both array and object formats
                    if isinstance(data, list):
                        self.applications = {app['id']: app for app in data}
                    else:
                        self.applications = data
        except Exception as e:
            print(f"Error loading data: {e}")
            self.applications = {}

    def _save_data(self):
        """Save applications to JSON file"""
        try:
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            with open(self.data_file, 'w') as f:
                json.dump(list(self.applications.values()), f, indent=2)
        except Exception as e:
            print(f"Error saving data: {e}")

    async def get_all_applications(self) -> List[Application]:
        """Get all applications"""
        try:
            return [Application(**app_data) for app_data in self.applications.values()]
        except Exception as e:
            print(f"Error fetching applications: {e}")
            return []

    async def get_application_by_id(self, app_id: str) -> Optional[Application]:
        """Get a specific application by ID"""
        try:
            if app_id in self.applications:
                return Application(**self.applications[app_id])
            return None
        except Exception as e:
            print(f"Error fetching application {app_id}: {e}")
            return None

    async def create_application(self, app_data: ApplicationCreate) -> Optional[Application]:
        """Create a new application"""
        try:
            # Generate a new ID
            app_id = str(uuid.uuid4())
            current_time = datetime.now().isoformat()
            
            # Create default health status
            health_status = {
                "status": "Starting",
                "lastCheck": current_time,
                "responseTime": 0,
                "uptime": 0,
                "errorRate": 0.0
            }
            
            # Create default metrics
            metrics = {
                "cpu": {
                    "current": 0.0,
                    "limit": 2.0,
                    "unit": "cores"
                },
                "memory": {
                    "current": 0,
                    "limit": 1024,
                    "unit": "Mi"
                },
                "network": {
                    "bytesIn": 0,
                    "bytesOut": 0
                },
                "requests": {
                    "total": 0,
                    "perSecond": 0.0,
                    "errors": 0
                }
            }
            
            # Create application document
            application_doc = {
                "id": app_id,
                "name": app_data.name,
                "description": app_data.description,
                "status": "Creating",
                "replicas": app_data.replicas,
                "created": current_time,
                "updated": current_time,
                "namespace": app_data.namespace,
                "image": app_data.image,
                "version": app_data.version,
                "environment": app_data.environment,
                "health": health_status,
                "metrics": metrics,
                "resources": app_data.resources.dict() if hasattr(app_data.resources, 'dict') else {},
                "logs": [],
                "vulnerabilities": [],
                "tags": app_data.tags,
                "owner": app_data.owner,
                "team": app_data.team
            }
            
            # Save to memory and file
            self.applications[app_id] = application_doc
            self._save_data()
            
            return Application(**application_doc)
        except Exception as e:
            print(f"Error creating application: {e}")
            return None

    async def update_application(self, app_id: str, app_data: ApplicationUpdate) -> Optional[Application]:
        """Update an existing application"""
        try:
            if app_id not in self.applications:
                return None
            
            current_app = self.applications[app_id]
            current_time = datetime.now().isoformat()
            
            # Update fields
            update_data = app_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                current_app[key] = value
            
            current_app['updated'] = current_time
            
            # Save to file
            self._save_data()
            
            return Application(**current_app)
        except Exception as e:
            print(f"Error updating application {app_id}: {e}")
            return None

    async def delete_application(self, app_id: str) -> bool:
        """Delete an application"""
        try:
            if app_id in self.applications:
                del self.applications[app_id]
                self._save_data()
                return True
            return False
        except Exception as e:
            print(f"Error deleting application {app_id}: {e}")
            return False

    async def update_application_metrics(self, app_id: str, metrics: Dict[str, Any]) -> bool:
        """Update application metrics"""
        try:
            if app_id in self.applications:
                self.applications[app_id]['metrics'] = metrics
                self.applications[app_id]['updated'] = datetime.now().isoformat()
                self._save_data()
                return True
            return False
        except Exception as e:
            print(f"Error updating metrics for {app_id}: {e}")
            return False

    async def update_application_health(self, app_id: str, health: Dict[str, Any]) -> bool:
        """Update application health status"""
        try:
            if app_id in self.applications:
                self.applications[app_id]['health'] = health
                self.applications[app_id]['updated'] = datetime.now().isoformat()
                self._save_data()
                return True
            return False
        except Exception as e:
            print(f"Error updating health for {app_id}: {e}")
            return False

    async def add_application_log(self, app_id: str, log_data: Dict[str, Any]) -> bool:
        """Add a log entry to an application"""
        try:
            if app_id in self.applications:
                if 'logs' not in self.applications[app_id]:
                    self.applications[app_id]['logs'] = []
                
                log_entry = {
                    "id": str(uuid.uuid4()),
                    "timestamp": datetime.now().isoformat(),
                    "level": log_data.get("level", "info"),
                    "message": log_data.get("message", ""),
                    "source": log_data.get("source", "application"),
                    "details": log_data.get("details", {})
                }
                
                self.applications[app_id]['logs'].append(log_entry)
                self.applications[app_id]['updated'] = datetime.now().isoformat()
                self._save_data()
                return True
            return False
        except Exception as e:
            print(f"Error adding log for {app_id}: {e}")
            return False

    async def add_application_vulnerability(self, app_id: str, vulnerability_data: Dict[str, Any]) -> bool:
        """Add a vulnerability to an application"""
        try:
            if app_id in self.applications:
                if 'vulnerabilities' not in self.applications[app_id]:
                    self.applications[app_id]['vulnerabilities'] = []
                
                vulnerability_entry = {
                    "id": str(uuid.uuid4()),
                    "timestamp": datetime.now().isoformat(),
                    "severity": vulnerability_data.get("severity", "medium"),
                    "title": vulnerability_data.get("title", ""),
                    "description": vulnerability_data.get("description", ""),
                    "cve": vulnerability_data.get("cve", ""),
                    "package": vulnerability_data.get("package", ""),
                    "version": vulnerability_data.get("version", ""),
                    "status": vulnerability_data.get("status", "open")
                }
                
                self.applications[app_id]['vulnerabilities'].append(vulnerability_entry)
                self.applications[app_id]['updated'] = datetime.now().isoformat()
                self._save_data()
                return True
            return False
        except Exception as e:
            print(f"Error adding vulnerability for {app_id}: {e}")
            return False 