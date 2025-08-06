import requests
import json
import time

def test_deployment_integration():
    base_url = "http://localhost:8000"
    
    print("Testing deployment integration...")
    
    response = requests.get(f"{base_url}/health")
    print(f"Health check status: {response.status_code}")
    if response.status_code == 200:
        print("Health check passed")
    else:
        print("Health check failed")
        return
    
    response = requests.get(f"{base_url}/api/applications")
    print(f"Get applications status: {response.status_code}")
    if response.status_code == 200:
        applications = response.json()
        print(f"Found {len(applications)} applications")
        if not applications:
            print("No applications found, cannot test deployments")
            return
        app_id = applications[0]['id']
    else:
        print("Failed to get applications")
        return
    
    response = requests.get(f"{base_url}/api/deployments")
    print(f"Get deployments status: {response.status_code}")
    if response.status_code == 200:
        deployments = response.json()
        print(f"Found {len(deployments)} deployments")
    else:
        print("Failed to get deployments")
    
    new_deployment = {
        "application_id": app_id,
        "version": "1.0.0",
        "environment": "staging",
        "strategy": "rolling",
        "replicas": 3,
        "resources": {
            "cpu": {"request": "200m", "limit": "1"},
            "memory": {"request": "256Mi", "limit": "1Gi"},
            "storage": {"size": "5Gi", "type": "SSD"}
        },
        "config": {
            "environment_variables": {"NODE_ENV": "staging"},
            "secrets": {"API_KEY": "secret-key"}
        },
        "triggered_by": "test@company.com"
    }
    
    response = requests.post(
        f"{base_url}/api/deployments",
        json=new_deployment
    )
    print(f"Create deployment status: {response.status_code}")
    if response.status_code == 200:
        created_deployment = response.json()
        print(f"Created deployment: {created_deployment['id']}")
        deployment_id = created_deployment['id']
    else:
        print("Failed to create deployment")
        return
    
    response = requests.get(f"{base_url}/api/deployments/{deployment_id}")
    print(f"Get created deployment status: {response.status_code}")
    if response.status_code == 200:
        deployment = response.json()
        print(f"Retrieved deployment: {deployment['id']}")
    else:
        print("Failed to get created deployment")
    
    response = requests.get(f"{base_url}/api/deployments")
    print(f"Get all deployments status: {response.status_code}")
    if response.status_code == 200:
        deployments = response.json()
        print(f"Total deployments: {len(deployments)}")
    else:
        print("Failed to get all deployments")
    
    if deployment_id:
        response = requests.post(f"{base_url}/api/deployments/{deployment_id}/rollback")
        print(f"Rollback deployment status: {response.status_code}")
        if response.status_code == 200:
            print("Rollback initiated successfully")
        else:
            print("Failed to rollback deployment")

if __name__ == "__main__":
    test_deployment_integration() 