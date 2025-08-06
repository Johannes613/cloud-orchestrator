import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.cluster_service import ClusterService

async def recalculate_deployment_counts():
    """Recalculate deployment counts for all clusters"""
    try:
        cluster_service = ClusterService()
        await cluster_service.recalculate_deployment_counts()
        print("✅ Deployment counts recalculated successfully")
        
        # Show the results
        clusters = await cluster_service.get_all_clusters()
        print("\n📊 Updated cluster deployment counts:")
        for cluster in clusters:
            print(f"  • {cluster.name}: {cluster.deployment_count} deployments")
            
    except Exception as e:
        print(f"❌ Error recalculating deployment counts: {e}")

if __name__ == "__main__":
    asyncio.run(recalculate_deployment_counts()) 