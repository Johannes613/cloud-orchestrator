import requests
import json
import time

def test_firebase_integration():
    base_url = "http://localhost:8000"
    
    print("Testing Firebase integration...")
    
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
    else:
        print("Failed to get applications")
        return
    
    new_application = {
        "name": "TestApp-Firebase",
        "description": "Test application for Firebase integration",
        "namespace": "test",
        "image": "nginx:latest",
        "version": "1.0.0",
        "environment": "test",
        "replicas": 1,
        "resources": {
            "cpu": {"request": "100m", "limit": "500m"},
            "memory": {"request": "128Mi", "limit": "512Mi"},
            "storage": {"size": "1Gi", "type": "SSD"}
        },
        "tags": ["test", "firebase"],
        "owner": "test@company.com",
        "team": "Testing"
    }
    
    response = requests.post(
        f"{base_url}/api/applications",
        json=new_application
    )
    print(f"Create application status: {response.status_code}")
    if response.status_code == 200:
        created_app = response.json()
        print(f"Created application: {created_app['name']}")
        app_id = created_app['id']
    else:
        print("Failed to create application")
        return
    
    response = requests.get(f"{base_url}/api/applications/{app_id}")
    print(f"Get created application status: {response.status_code}")
    if response.status_code == 200:
        app = response.json()
        print(f"Retrieved application: {app['name']}")
    else:
        print("Failed to get created application")
    
    response = requests.get(f"{base_url}/api/applications")
    print(f"Get all applications status: {response.status_code}")
    if response.status_code == 200:
        applications = response.json()
        print(f"Total applications: {len(applications)}")
    else:
        print("Failed to get all applications")

if __name__ == "__main__":
    test_firebase_integration() 