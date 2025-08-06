import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.gitops_service import GitOpsService
from services.deployment_service import DeploymentService

async def sync_gitops_deployments():
    """Sync GitOps deployment counts with main deployments"""
    try:
        gitops_service = GitOpsService()
        deployment_service = DeploymentService()
        
        # Get main deployment count
        main_deployments = await deployment_service.get_all_deployments()
        main_deployment_count = len(main_deployments)
        
        print(f"📊 Main deployments count: {main_deployment_count}")
        
        # Sync GitOps
        await gitops_service.sync_with_main_deployments()
        
        # Show the results
        gitops_repos = await gitops_service.get_all_repositories()
        print(f"\n📊 GitOps repositories after sync:")
        for repo in gitops_repos:
            print(f"  • {repo.name}: {repo.deploymentCount} deployments")
        
        # Verify sync
        gitops_total = sum(repo.deploymentCount for repo in gitops_repos)
        print(f"\n✅ Sync verification:")
        print(f"  • Main deployments: {main_deployment_count}")
        print(f"  • GitOps total: {gitops_total}")
        print(f"  • Synchronized: {'✅ Yes' if main_deployment_count == gitops_total else '❌ No'}")
        
    except Exception as e:
        print(f"❌ Error syncing GitOps deployments: {e}")

if __name__ == "__main__":
    asyncio.run(sync_gitops_deployments()) 