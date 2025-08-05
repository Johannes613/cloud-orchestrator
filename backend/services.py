from firebase_admin import firestore
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from .firebase_config import get_firestore_db
from .models import Application, ApplicationCreate, ApplicationUpdate

class ApplicationService:
    def __init__(self):
        self.db = get_firestore_db()
        self.collection = self.db.collection('applications')

    async def get_all_applications(self) -> List[Application]:
        """Get all applications from Firebase"""
        try:
            docs = self.collection.stream()
            applications = []
            for doc in docs:
                app_data = doc.to_dict()
                app_data['id'] = doc.id
                applications.append(Application(**app_data))
            return applications
        except Exception as e:
            print(f"Error fetching applications: {e}")
            return []

    async def get_application_by_id(self, app_id: str) -> Optional[Application]:
        """Get a specific application by ID"""
        try:
            doc = self.collection.document(app_id).get()
            if doc.exists:
                app_data = doc.to_dict()
                app_data['id'] = doc.id
                return Application(**app_data)
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
                    "limit": float(app_data.resources.cpu.limit.replace('m', '').replace('c', '')),
                    "unit": "cores"
                },
                "memory": {
                    "current": 0,
                    "limit": int(app_data.resources.memory.limit.replace('Mi', '').replace('Gi', '000')),
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
                "resources": app_data.resources.dict(),
                "logs": [],
                "vulnerabilities": [],
                "tags": app_data.tags,
                "owner": app_data.owner,
                "team": app_data.team
            }
            
            # Save to Firebase
            self.collection.document(app_id).set(application_doc)
            
            return Application(**application_doc)
        except Exception as e:
            print(f"Error creating application: {e}")
            return None

    async def update_application(self, app_id: str, app_data: ApplicationUpdate) -> Optional[Application]:
        """Update an existing application"""
        try:
            doc_ref = self.collection.document(app_id)
            doc = doc_ref.get()
            
            if not doc.exists:
                return None
            
            # Get current data
            current_data = doc.to_dict()
            
            # Update only provided fields
            update_data = {}
            for field, value in app_data.dict(exclude_unset=True).items():
                if value is not None:
                    update_data[field] = value
            
            # Add updated timestamp
            update_data['updated'] = datetime.now().isoformat()
            
            # Update the document
            doc_ref.update(update_data)
            
            # Return updated application
            updated_doc = doc_ref.get()
            updated_data = updated_doc.to_dict()
            updated_data['id'] = updated_doc.id
            
            return Application(**updated_data)
        except Exception as e:
            print(f"Error updating application {app_id}: {e}")
            return None

    async def delete_application(self, app_id: str) -> bool:
        """Delete an application"""
        try:
            doc_ref = self.collection.document(app_id)
            doc = doc_ref.get()
            
            if not doc.exists:
                return False
            
            doc_ref.delete()
            return True
        except Exception as e:
            print(f"Error deleting application {app_id}: {e}")
            return False

    async def update_application_metrics(self, app_id: str, metrics: Dict[str, Any]) -> bool:
        """Update application metrics"""
        try:
            doc_ref = self.collection.document(app_id)
            doc = doc_ref.get()
            
            if not doc.exists:
                return False
            
            update_data = {
                'metrics': metrics,
                'updated': datetime.now().isoformat()
            }
            
            doc_ref.update(update_data)
            return True
        except Exception as e:
            print(f"Error updating metrics for application {app_id}: {e}")
            return False

    async def update_application_health(self, app_id: str, health: Dict[str, Any]) -> bool:
        """Update application health status"""
        try:
            doc_ref = self.collection.document(app_id)
            doc = doc_ref.get()
            
            if not doc.exists:
                return False
            
            update_data = {
                'health': health,
                'updated': datetime.now().isoformat()
            }
            
            doc_ref.update(update_data)
            return True
        except Exception as e:
            print(f"Error updating health for application {app_id}: {e}")
            return False

    async def add_application_log(self, app_id: str, log_data: Dict[str, Any]) -> bool:
        """Add a log entry to an application"""
        try:
            doc_ref = self.collection.document(app_id)
            doc = doc_ref.get()
            
            if not doc.exists:
                return False
            
            current_data = doc.to_dict()
            logs = current_data.get('logs', [])
            
            # Add log with ID
            log_entry = {
                'id': str(uuid.uuid4()),
                'timestamp': datetime.now().isoformat(),
                **log_data
            }
            
            logs.append(log_entry)
            
            # Keep only last 100 logs
            if len(logs) > 100:
                logs = logs[-100:]
            
            update_data = {
                'logs': logs,
                'updated': datetime.now().isoformat()
            }
            
            doc_ref.update(update_data)
            return True
        except Exception as e:
            print(f"Error adding log for application {app_id}: {e}")
            return False

    async def add_application_vulnerability(self, app_id: str, vulnerability_data: Dict[str, Any]) -> bool:
        """Add a vulnerability to an application"""
        try:
            doc_ref = self.collection.document(app_id)
            doc = doc_ref.get()
            
            if not doc.exists:
                return False
            
            current_data = doc.to_dict()
            vulnerabilities = current_data.get('vulnerabilities', [])
            
            # Add vulnerability with ID
            vulnerability_entry = {
                'id': str(uuid.uuid4()),
                **vulnerability_data
            }
            
            vulnerabilities.append(vulnerability_entry)
            
            update_data = {
                'vulnerabilities': vulnerabilities,
                'updated': datetime.now().isoformat()
            }
            
            doc_ref.update(update_data)
            return True
        except Exception as e:
            print(f"Error adding vulnerability for application {app_id}: {e}")
            return False 