from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import json
import os
from models.deployment import Deployment, DeploymentCreate, DeploymentUpdate, DeploymentResources

class DeploymentService:
    def __init__(self):
        self.deployments = {}
        self.data_file = "data/deployments.json"
        self._load_data()

    def _load_data(self):
        """Load deployments from JSON file"""
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    # Handle both array and object formats
                    if isinstance(data, list):
                        self.deployments = {item['id']: item for item in data}
                    else:
                        self.deployments = data
        except Exception as e:
            print(f"Error loading deployment data: {e}")
            self.deployments = {}

    def _save_data(self):
        """Save deployments to JSON file"""
        try:
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            with open(self.data_file, 'w') as f:
                json.dump(self.deployments, f, indent=2)
        except Exception as e:
            print(f"Error saving deployment data: {e}")

    async def get_all_deployments(self) -> List[Deployment]:
        """Get all deployments"""
        try:
            return [Deployment(**deployment_data) for deployment_data in self.deployments.values()]
        except Exception as e:
            print(f"Error fetching deployments: {e}")
            return []

    async def get_deployment_by_id(self, deployment_id: str) -> Optional[Deployment]:
        """Get a specific deployment by ID"""
        try:
            if deployment_id in self.deployments:
                return Deployment(**self.deployments[deployment_id])
            return None
        except Exception as e:
            print(f"Error fetching deployment {deployment_id}: {e}")
            return None

    async def create_deployment(self, deployment_data: DeploymentCreate) -> Optional[Deployment]:
        """Create a new deployment"""
        try:
            deployment_id = str(uuid.uuid4())
            current_time = datetime.now().isoformat()
            
            # Default resources if not provided
            if not deployment_data.resources:
                deployment_data.resources = DeploymentResources(
                    cpu={"request": "100m", "limit": "500m"},
                    memory={"request": "128Mi", "limit": "512Mi"}
                )
            
            # Create deployment document
            deployment_doc = {
                "id": deployment_id,
                "application_id": deployment_data.application_id,
                "version": deployment_data.version,
                "status": "Pending",
                "commit_hash": deployment_data.commit_hash,
                "environment": deployment_data.environment,
                "deployed_at": current_time,
                "logs_url": f"https://logs.example.com/deployment-{deployment_id}",
                "duration": 0,
                "created": current_time,
                "updated": current_time,
                "description": deployment_data.description,
                "triggered_by": deployment_data.triggered_by,
                "rollback_version": "",
                "deployment_strategy": deployment_data.deployment_strategy,
                "replicas": deployment_data.replicas,
                "resources": deployment_data.resources.dict()
            }
            
            # Save to memory and file
            self.deployments[deployment_id] = deployment_doc
            self._save_data()
            
            return Deployment(**deployment_doc)
        except Exception as e:
            print(f"Error creating deployment: {e}")
            return None

    async def update_deployment(self, deployment_id: str, deployment_data: DeploymentUpdate) -> Optional[Deployment]:
        """Update an existing deployment"""
        try:
            if deployment_id not in self.deployments:
                return None
            
            current_deployment = self.deployments[deployment_id]
            current_time = datetime.now().isoformat()
            
            # Update fields
            update_data = deployment_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                if key == "resources" and value:
                    current_deployment[key] = value.dict()
                else:
                    current_deployment[key] = value
            
            current_deployment['updated'] = current_time
            
            # Save to file
            self._save_data()
            
            return Deployment(**current_deployment)
        except Exception as e:
            print(f"Error updating deployment {deployment_id}: {e}")
            return None

    async def delete_deployment(self, deployment_id: str) -> bool:
        """Delete a deployment"""
        try:
            if deployment_id in self.deployments:
                del self.deployments[deployment_id]
                self._save_data()
                return True
            return False
        except Exception as e:
            print(f"Error deleting deployment {deployment_id}: {e}")
            return False

    async def rollback_deployment(self, deployment_id: str) -> Optional[Deployment]:
        """Rollback a deployment"""
        try:
            if deployment_id not in self.deployments:
                return None
            
            current_deployment = self.deployments[deployment_id]
            
            # Create rollback deployment
            rollback_id = str(uuid.uuid4())
            current_time = datetime.now().isoformat()
            
            rollback_deployment = {
                "id": rollback_id,
                "application_id": current_deployment["application_id"],
                "version": current_deployment.get("rollback_version", "v1.0.0"),
                "status": "Pending",
                "commit_hash": f"rollback-{current_deployment['commit_hash']}",
                "environment": current_deployment["environment"],
                "deployed_at": current_time,
                "logs_url": f"https://logs.example.com/deployment-{rollback_id}",
                "duration": 0,
                "created": current_time,
                "updated": current_time,
                "description": f"Rollback of {current_deployment['version']}",
                "triggered_by": current_deployment["triggered_by"],
                "rollback_version": current_deployment["version"],
                "deployment_strategy": current_deployment["deployment_strategy"],
                "replicas": current_deployment["replicas"],
                "resources": current_deployment["resources"]
            }
            
            # Save rollback deployment
            self.deployments[rollback_id] = rollback_deployment
            self._save_data()
            
            return Deployment(**rollback_deployment)
        except Exception as e:
            print(f"Error rolling back deployment {deployment_id}: {e}")
            return None 