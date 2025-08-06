import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.application_service import ApplicationService
from models.application import ApplicationCreate, CPUResources, MemoryResources, StorageResources, Resources
from datetime import datetime

async def seed_initial_data():
    """Seed initial application data"""
    try:
        service = ApplicationService()
        
        # Check if we already have data
        if service.applications:
            print("✅ Data already exists, skipping seed")
            return
        
        # Sample applications data
        applications = [
            {
                "name": "WebApp-1",
                "description": "Main web application for customer portal",
                "namespace": "default",
                "image": "nginx:1.24",
                "version": "2.1.0",
                "environment": "production",
                "replicas": 3,
                "resources": Resources(
                    cpu=CPUResources(request="500m", limit="2"),
                    memory=MemoryResources(request="256Mi", limit="1Gi"),
                    storage=StorageResources(size="10Gi", type="SSD")
                ),
                "tags": ["web", "frontend", "customer-portal"],
                "owner": "john.doe@company.com",
                "team": "Frontend"
            },
            {
                "name": "Microservice-A",
                "description": "Authentication and authorization service",
                "namespace": "auth",
                "image": "auth-service:1.2.0",
                "version": "1.2.0",
                "environment": "staging",
                "replicas": 1,
                "resources": Resources(
                    cpu=CPUResources(request="200m", limit="1"),
                    memory=MemoryResources(request="512Mi", limit="1Gi"),
                    storage=StorageResources(size="5Gi", type="SSD")
                ),
                "tags": ["microservice", "auth", "security"],
                "owner": "jane.smith@company.com",
                "team": "Backend"
            },
            {
                "name": "DataProcessor",
                "description": "Data processing and analytics service",
                "namespace": "data",
                "image": "data-processor:2.0.1",
                "version": "2.0.1",
                "environment": "production",
                "replicas": 2,
                "resources": Resources(
                    cpu=CPUResources(request="1", limit="4"),
                    memory=MemoryResources(request="1Gi", limit="2Gi"),
                    storage=StorageResources(size="20Gi", type="SSD")
                ),
                "tags": ["data", "analytics", "processing"],
                "owner": "bob.wilson@company.com",
                "team": "Data"
            },
            {
                "name": "AuthService",
                "description": "User authentication service",
                "namespace": "auth",
                "image": "auth-service:1.1.5",
                "version": "1.1.5",
                "environment": "production",
                "replicas": 2,
                "resources": Resources(
                    cpu=CPUResources(request="300m", limit="1"),
                    memory=MemoryResources(request="256Mi", limit="1Gi"),
                    storage=StorageResources(size="2Gi", type="SSD")
                ),
                "tags": ["auth", "security", "user-management"],
                "owner": "alice.johnson@company.com",
                "team": "Security"
            },
            {
                "name": "API-Gateway",
                "description": "API gateway and load balancer",
                "namespace": "gateway",
                "image": "api-gateway:1.0.3",
                "version": "1.0.3",
                "environment": "production",
                "replicas": 1,
                "resources": Resources(
                    cpu=CPUResources(request="200m", limit="1"),
                    memory=MemoryResources(request="128Mi", limit="512Mi"),
                    storage=StorageResources(size="1Gi", type="SSD")
                ),
                "tags": ["gateway", "api", "load-balancer"],
                "owner": "david.brown@company.com",
                "team": "DevOps"
            }
        ]
        
        # Create applications
        for app_data in applications:
            try:
                app_create = ApplicationCreate(**app_data)
                await service.create_application(app_create)
            except Exception as e:
                print(f"Error creating application {app_data['name']}: {e}")
        
        print("✅ Initial data seeded successfully")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")

if __name__ == "__main__":
    asyncio.run(seed_initial_data()) 