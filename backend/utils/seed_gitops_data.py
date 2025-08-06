import asyncio
import sys
import os
from datetime import datetime, timedelta
import uuid

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.gitops_service import GitOpsService
from models.gitops import RepositoryCreate, GitOpsDeploymentCreate

async def seed_gitops_data():
    """Seed GitOps with sample data"""
    try:
        service = GitOpsService()
        
        # Check if we already have data
        if service.repositories:
            print("✅ GitOps data already exists, skipping seed")
            return
        
        # Sample repositories
        repositories = [
            {
                "name": "infra-configs",
                "url": "https://github.com/company/infra-configs.git",
                "branch": "main",
                "environment": "production",
                "namespace": "infra",
                "path": "k8s/",
                "autoDeploy": True,
                "syncInterval": 300
            },
            {
                "name": "app-frontend",
                "url": "https://github.com/company/app-frontend.git",
                "branch": "develop",
                "environment": "staging",
                "namespace": "frontend",
                "path": "deploy/",
                "autoDeploy": False,
                "syncInterval": 600
            },
            {
                "name": "api-backend",
                "url": "https://github.com/company/api-backend.git",
                "branch": "main",
                "environment": "production",
                "namespace": "backend",
                "path": "helm/",
                "autoDeploy": True,
                "syncInterval": 300
            },
            {
                "name": "monitoring-stack",
                "url": "https://github.com/company/monitoring-stack.git",
                "branch": "main",
                "environment": "production",
                "namespace": "monitoring",
                "path": "prometheus/",
                "autoDeploy": True,
                "syncInterval": 900
            }
        ]
        
        # Create repositories
        created_repos = []
        for repo_data in repositories:
            try:
                repo_create = RepositoryCreate(**repo_data)
                repository = await service.create_repository(repo_create)
                if repository:
                    created_repos.append(repository)
                    print(f"✓ Created repository: {repository.name}")
            except Exception as e:
                print(f"✗ Error creating repository {repo_data['name']}: {e}")
        
        # Create sample deployments for each repository
        for repo in created_repos:
            # Create 5-10 deployments per repository
            for i in range(5):
                deployment_data = GitOpsDeploymentCreate(
                    repository_id=repo.id,
                    commit_hash=f"abc{i}def{i}",
                    branch=repo.branch,
                    environment=repo.environment,
                    description=f"Sample deployment #{i+1} for {repo.name}",
                    triggered_by="yohannis",
                    author="yohannis"
                )
                
                try:
                    deployment = await service.create_gitops_deployment(deployment_data)
                    if deployment:
                        # Update some deployments to success/failed status
                        if i % 3 == 0:
                            await service.update_deployment_status(deployment.id, "success", 120 + i * 10)
                        elif i % 3 == 1:
                            await service.update_deployment_status(deployment.id, "failed", 60 + i * 5)
                        # Leave some as pending
                        
                        print(f"✓ Created deployment for {repo.name}: {deployment.status}")
                except Exception as e:
                    print(f"✗ Error creating deployment for {repo.name}: {e}")
        
        print("✅ GitOps data seeded successfully")
        
    except Exception as e:
        print(f"❌ Error seeding GitOps data: {e}")

if __name__ == "__main__":
    asyncio.run(seed_gitops_data()) 