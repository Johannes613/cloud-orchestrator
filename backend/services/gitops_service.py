from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import json
import os
from models.gitops import Repository, RepositoryCreate, RepositoryUpdate, GitOpsDeployment, GitOpsDeploymentCreate, GitOpsDeploymentUpdate

class GitOpsService:
    def __init__(self):
        self.repositories = {}
        self.deployments = {}
        self.repos_file = "data/gitops_repositories.json"
        self.deployments_file = "data/gitops_deployments.json"
        self._load_data()

    def _load_data(self):
        """Load GitOps data from JSON files"""
        try:
            # Load repositories
            if os.path.exists(self.repos_file):
                with open(self.repos_file, 'r') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        self.repositories = {item['id']: item for item in data}
                    else:
                        self.repositories = data
            
            # Load deployments
            if os.path.exists(self.deployments_file):
                with open(self.deployments_file, 'r') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        self.deployments = {item['id']: item for item in data}
                    else:
                        self.deployments = data
        except Exception as e:
            print(f"Error loading GitOps data: {e}")
            self.repositories = {}
            self.deployments = {}

    def _save_repositories(self):
        """Save repositories to JSON file"""
        try:
            os.makedirs(os.path.dirname(self.repos_file), exist_ok=True)
            with open(self.repos_file, 'w') as f:
                json.dump(list(self.repositories.values()), f, indent=2)
        except Exception as e:
            print(f"Error saving repositories: {e}")

    def _save_deployments(self):
        """Save deployments to JSON file"""
        try:
            os.makedirs(os.path.dirname(self.deployments_file), exist_ok=True)
            with open(self.deployments_file, 'w') as f:
                json.dump(list(self.deployments.values()), f, indent=2)
        except Exception as e:
            print(f"Error saving GitOps deployments: {e}")

    # Repository methods
    async def get_all_repositories(self) -> List[Repository]:
        """Get all repositories"""
        try:
            return [Repository(**repo_data) for repo_data in self.repositories.values()]
        except Exception as e:
            print(f"Error fetching repositories: {e}")
            return []

    async def get_repository_by_id(self, repo_id: str) -> Optional[Repository]:
        """Get a specific repository by ID"""
        try:
            if repo_id in self.repositories:
                return Repository(**self.repositories[repo_id])
            return None
        except Exception as e:
            print(f"Error fetching repository {repo_id}: {e}")
            return None

    async def create_repository(self, repo_data: RepositoryCreate) -> Optional[Repository]:
        """Create a new repository"""
        try:
            repo_id = str(uuid.uuid4())
            current_time = datetime.now().isoformat()
            
            repository_doc = {
                "id": repo_id,
                "name": repo_data.name,
                "url": repo_data.url,
                "branch": repo_data.branch,
                "autoDeploy": repo_data.autoDeploy,
                "status": "Active",
                "lastDeployed": current_time,
                "environment": repo_data.environment,
                "namespace": repo_data.namespace,
                "path": repo_data.path,
                "syncInterval": repo_data.syncInterval,
                "lastSync": current_time,
                "commitCount": 0,
                "deploymentCount": 0
            }
            
            self.repositories[repo_id] = repository_doc
            self._save_repositories()
            
            return Repository(**repository_doc)
        except Exception as e:
            print(f"Error creating repository: {e}")
            return None

    async def update_repository(self, repo_id: str, repo_data: RepositoryUpdate) -> Optional[Repository]:
        """Update an existing repository"""
        try:
            if repo_id not in self.repositories:
                return None
            
            current_repo = self.repositories[repo_id]
            current_time = datetime.now().isoformat()
            
            update_data = repo_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                current_repo[key] = value
            
            current_repo['updated'] = current_time
            
            self._save_repositories()
            
            return Repository(**current_repo)
        except Exception as e:
            print(f"Error updating repository {repo_id}: {e}")
            return None

    async def delete_repository(self, repo_id: str) -> bool:
        """Delete a repository"""
        try:
            if repo_id in self.repositories:
                del self.repositories[repo_id]
                self._save_repositories()
                return True
            return False
        except Exception as e:
            print(f"Error deleting repository {repo_id}: {e}")
            return False

    # GitOps Deployment methods
    async def get_all_gitops_deployments(self) -> List[GitOpsDeployment]:
        """Get all GitOps deployments"""
        try:
            return [GitOpsDeployment(**deployment_data) for deployment_data in self.deployments.values()]
        except Exception as e:
            print(f"Error fetching GitOps deployments: {e}")
            return []

    async def get_gitops_deployment_by_id(self, deployment_id: str) -> Optional[GitOpsDeployment]:
        """Get a specific GitOps deployment by ID"""
        try:
            if deployment_id in self.deployments:
                return GitOpsDeployment(**self.deployments[deployment_id])
            return None
        except Exception as e:
            print(f"Error fetching GitOps deployment {deployment_id}: {e}")
            return None

    async def create_gitops_deployment(self, deployment_data: GitOpsDeploymentCreate) -> Optional[GitOpsDeployment]:
        """Create a new GitOps deployment"""
        try:
            deployment_id = str(uuid.uuid4())
            current_time = datetime.now().isoformat()
            
            deployment_doc = {
                "id": deployment_id,
                "repository_id": deployment_data.repository_id,
                "commit_hash": deployment_data.commit_hash,
                "branch": deployment_data.branch,
                "environment": deployment_data.environment,
                "status": "Pending",
                "description": deployment_data.description,
                "triggered_by": deployment_data.triggered_by,
                "created": current_time,
                "updated": current_time,
                "deployed_at": None,
                "duration": 0,
                "logs_url": f"https://logs.example.com/gitops-deployment-{deployment_id}"
            }
            
            self.deployments[deployment_id] = deployment_doc
            self._save_deployments()
            
            return GitOpsDeployment(**deployment_doc)
        except Exception as e:
            print(f"Error creating GitOps deployment: {e}")
            return None

    async def update_gitops_deployment(self, deployment_id: str, deployment_data: GitOpsDeploymentUpdate) -> Optional[GitOpsDeployment]:
        """Update an existing GitOps deployment"""
        try:
            if deployment_id not in self.deployments:
                return None
            
            current_deployment = self.deployments[deployment_id]
            current_time = datetime.now().isoformat()
            
            update_data = deployment_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                current_deployment[key] = value
            
            current_deployment['updated'] = current_time
            
            self._save_deployments()
            
            return GitOpsDeployment(**current_deployment)
        except Exception as e:
            print(f"Error updating GitOps deployment {deployment_id}: {e}")
            return None

    async def delete_gitops_deployment(self, deployment_id: str) -> bool:
        """Delete a GitOps deployment"""
        try:
            if deployment_id in self.deployments:
                del self.deployments[deployment_id]
                self._save_deployments()
                return True
            return False
        except Exception as e:
            print(f"Error deleting GitOps deployment {deployment_id}: {e}")
            return False 