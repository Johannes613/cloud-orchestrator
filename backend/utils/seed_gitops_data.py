import json
import os
from typing import List, Dict, Any

def seed_gitops_data():
    try:
        if os.path.exists('data/gitops_repositories.json'):
            with open('data/gitops_repositories.json', 'r') as f:
                existing_data = json.load(f)
                if existing_data:
                    print("GitOps data already exists, skipping seed")
                    return
        
        repositories = [
            {
                "id": "repo-001",
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
                "id": "repo-002",
                "name": "app-frontend",
                "url": "https://github.com/company/app-frontend.git",
                "branch": "develop",
                "environment": "staging",
                "namespace": "frontend",
                "path": "deploy/",
                "autoDeploy": False,
                "syncInterval": 600
            }
        ]
        
        with open('data/gitops_repositories.json', 'w') as f:
            json.dump(repositories, f, indent=2)
        
        print("GitOps data seeded successfully")
        
    except Exception as e:
        print(f"Error seeding GitOps data: {e}")

if __name__ == "__main__":
    seed_gitops_data() 