import json
import os

def recalculate_deployment_counts():
    try:
        with open('data/clusters.json', 'r') as f:
            clusters = json.load(f)
        
        with open('data/deployments.json', 'r') as f:
            deployments = json.load(f)
        
        for cluster in clusters:
            cluster['deployment_count'] = len([d for d in deployments if d.get('cluster_id') == cluster['id']])
        
        with open('data/clusters.json', 'w') as f:
            json.dump(clusters, f, indent=2)
        
        print("Deployment counts recalculated successfully")
        
        print("\nUpdated cluster deployment counts:")
        for cluster in clusters:
            print(f"  • {cluster['name']}: {cluster['deployment_count']} deployments")
            
    except Exception as e:
        print(f"Error recalculating deployment counts: {e}")

if __name__ == "__main__":
    recalculate_deployment_counts() 