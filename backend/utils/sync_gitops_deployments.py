import json
import os
from typing import List, Dict, Any

def sync_gitops_deployments():
    try:
        main_deployment_count = 0
        with open('data/deployments.json', 'r') as f:
            main_deployments = json.load(f)
            main_deployment_count = len(main_deployments)
        
        print(f"Main deployments count: {main_deployment_count}")
        
        with open('data/gitops_repositories.json', 'r') as f:
            gitops_repos = json.load(f)
        
        for repo in gitops_repos:
            repo['deploymentCount'] = main_deployment_count // len(gitops_repos)
        
        with open('data/gitops_repositories.json', 'w') as f:
            json.dump(gitops_repos, f, indent=2)
        
        print(f"\nGitOps repositories after sync:")
        for repo in gitops_repos:
            print(f"  • {repo['name']}: {repo['deploymentCount']} deployments")
        
        gitops_total = sum(repo['deploymentCount'] for repo in gitops_repos)
        
        print(f"\nSync verification:")
        print(f"  • Main deployments: {main_deployment_count}")
        print(f"  • GitOps total: {gitops_total}")
        print(f"  • Synchronized: {'Yes' if main_deployment_count == gitops_total else 'No'}")
        
    except Exception as e:
        print(f"Error syncing GitOps deployments: {e}")

if __name__ == "__main__":
    sync_gitops_deployments() 