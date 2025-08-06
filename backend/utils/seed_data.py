import json
import os
from typing import List, Dict, Any

def seed_initial_data():
    try:
        if os.path.exists('data/applications.json'):
            with open('data/applications.json', 'r') as f:
                existing_data = json.load(f)
                if existing_data:
                    print("Data already exists, skipping seed")
                    return
        
        applications = [
            {
                "id": "app-001",
                "name": "WebApp-1",
                "description": "Main web application for customer portal",
                "namespace": "default",
                "image": "nginx:1.24",
                "version": "2.1.0",
                "environment": "production",
                "replicas": 3,
                "resources": {
                    "cpu": {"request": "500m", "limit": "2"},
                    "memory": {"request": "256Mi", "limit": "1Gi"},
                    "storage": {"size": "10Gi", "type": "SSD"}
                },
                "tags": ["web", "frontend", "customer-portal"],
                "owner": "john.doe@company.com",
                "team": "Frontend",
                "status": "running",
                "health": "healthy",
                "created_at": "2024-01-15T10:00:00Z",
                "updated_at": "2024-01-15T10:00:00Z"
            },
            {
                "id": "app-002",
                "name": "Microservice-A",
                "description": "Authentication and authorization service",
                "namespace": "auth",
                "image": "auth-service:1.2.0",
                "version": "1.2.0",
                "environment": "staging",
                "replicas": 1,
                "resources": {
                    "cpu": {"request": "200m", "limit": "1"},
                    "memory": {"request": "512Mi", "limit": "1Gi"},
                    "storage": {"size": "5Gi", "type": "SSD"}
                },
                "tags": ["microservice", "auth", "security"],
                "owner": "jane.smith@company.com",
                "team": "Backend",
                "status": "running",
                "health": "healthy",
                "created_at": "2024-01-15T10:00:00Z",
                "updated_at": "2024-01-15T10:00:00Z"
            }
        ]
        
        with open('data/applications.json', 'w') as f:
            json.dump(applications, f, indent=2)
        
        print("Data seeded successfully")
        
    except Exception as e:
        print(f"Error seeding data: {e}")

if __name__ == "__main__":
    seed_initial_data() 