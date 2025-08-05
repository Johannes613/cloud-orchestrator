from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import json
from datetime import datetime
import uuid

app = FastAPI(title="Cloud Native App Orchestrator API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo purposes
applications_db = {}

@app.get("/")
def read_root():
    return {"message": "Cloud Native App Orchestrator API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Cloud Native App Orchestrator API"}

# Application endpoints
@app.get("/api/applications")
async def get_applications():
    """Get all applications"""
    try:
        return list(applications_db.values())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching applications: {str(e)}")

@app.get("/api/applications/{app_id}")
async def get_application(app_id: str):
    """Get a specific application by ID"""
    try:
        if app_id not in applications_db:
            raise HTTPException(status_code=404, detail="Application not found")
        return applications_db[app_id]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching application: {str(e)}")

@app.post("/api/applications")
async def create_application(app_data: Dict[str, Any]):
    """Create a new application"""
    try:
        app_id = str(uuid.uuid4())
        current_time = datetime.now().isoformat()
        
        # Create default health status
        health_status = {
            "status": "Starting",
            "lastCheck": current_time,
            "responseTime": 0,
            "uptime": 0,
            "errorRate": 0.0
        }
        
        # Create default metrics
        metrics = {
            "cpu": {
                "current": 0.0,
                "limit": 2.0,
                "unit": "cores"
            },
            "memory": {
                "current": 0,
                "limit": 1024,
                "unit": "Mi"
            },
            "network": {
                "bytesIn": 0,
                "bytesOut": 0
            },
            "requests": {
                "total": 0,
                "perSecond": 0.0,
                "errors": 0
            }
        }
        
        # Create application document
        application_doc = {
            "id": app_id,
            "name": app_data.get("name", "New Application"),
            "description": app_data.get("description", ""),
            "status": "Creating",
            "replicas": app_data.get("replicas", 1),
            "created": current_time,
            "updated": current_time,
            "namespace": app_data.get("namespace", "default"),
            "image": app_data.get("image", "nginx:latest"),
            "version": app_data.get("version", "1.0.0"),
            "environment": app_data.get("environment", "development"),
            "health": health_status,
            "metrics": metrics,
            "resources": app_data.get("resources", {
                "cpu": {"request": "100m", "limit": "500m"},
                "memory": {"request": "128Mi", "limit": "512Mi"},
                "storage": {"size": "1Gi", "type": "SSD"}
            }),
            "logs": [],
            "vulnerabilities": [],
            "tags": app_data.get("tags", []),
            "owner": app_data.get("owner", "admin@company.com"),
            "team": app_data.get("team", "DevOps")
        }
        
        applications_db[app_id] = application_doc
        return application_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating application: {str(e)}")

@app.put("/api/applications/{app_id}")
async def update_application(app_id: str, app_data: Dict[str, Any]):
    """Update an existing application"""
    try:
        if app_id not in applications_db:
            raise HTTPException(status_code=404, detail="Application not found")
        
        current_app = applications_db[app_id]
        
        # Update only provided fields
        for field, value in app_data.items():
            if value is not None:
                current_app[field] = value
        
        current_app['updated'] = datetime.now().isoformat()
        applications_db[app_id] = current_app
        
        return current_app
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating application: {str(e)}")

@app.delete("/api/applications/{app_id}")
async def delete_application(app_id: str):
    """Delete an application"""
    try:
        if app_id not in applications_db:
            raise HTTPException(status_code=404, detail="Application not found")
        
        del applications_db[app_id]
        return {"message": "Application deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting application: {str(e)}")

@app.put("/api/applications/{app_id}/metrics")
async def update_application_metrics(app_id: str, metrics: Dict[str, Any]):
    """Update application metrics"""
    try:
        if app_id not in applications_db:
            raise HTTPException(status_code=404, detail="Application not found")
        
        applications_db[app_id]['metrics'] = metrics
        applications_db[app_id]['updated'] = datetime.now().isoformat()
        
        return {"message": "Metrics updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating metrics: {str(e)}")

@app.put("/api/applications/{app_id}/health")
async def update_application_health(app_id: str, health: Dict[str, Any]):
    """Update application health status"""
    try:
        if app_id not in applications_db:
            raise HTTPException(status_code=404, detail="Application not found")
        
        applications_db[app_id]['health'] = health
        applications_db[app_id]['updated'] = datetime.now().isoformat()
        
        return {"message": "Health status updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating health: {str(e)}")

@app.post("/api/applications/{app_id}/logs")
async def add_application_log(app_id: str, log_data: Dict[str, Any]):
    """Add a log entry to an application"""
    try:
        if app_id not in applications_db:
            raise HTTPException(status_code=404, detail="Application not found")
        
        log_entry = {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            **log_data
        }
        
        applications_db[app_id]['logs'].append(log_entry)
        applications_db[app_id]['updated'] = datetime.now().isoformat()
        
        return {"message": "Log entry added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding log: {str(e)}")

@app.post("/api/applications/{app_id}/vulnerabilities")
async def add_application_vulnerability(app_id: str, vulnerability_data: Dict[str, Any]):
    """Add a vulnerability to an application"""
    try:
        if app_id not in applications_db:
            raise HTTPException(status_code=404, detail="Application not found")
        
        vulnerability_entry = {
            'id': str(uuid.uuid4()),
            **vulnerability_data
        }
        
        applications_db[app_id]['vulnerabilities'].append(vulnerability_entry)
        applications_db[app_id]['updated'] = datetime.now().isoformat()
        
        return {"message": "Vulnerability added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding vulnerability: {str(e)}")

# Seed some initial data
def seed_initial_data():
    """Seed some initial application data"""
    sample_apps = [
        {
            "name": "WebApp-1",
            "description": "Main web application for customer portal",
            "namespace": "default",
            "image": "nginx:1.24",
            "version": "2.1.0",
            "environment": "production",
            "replicas": 3,
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
            "tags": ["microservice", "auth", "security"],
            "owner": "jane.smith@company.com",
            "team": "Backend"
        }
    ]
    
    for app_data in sample_apps:
        app_id = str(uuid.uuid4())
        current_time = datetime.now().isoformat()
        
        health_status = {
            "status": "Running",
            "lastCheck": current_time,
            "responseTime": 120,
            "uptime": 86400,
            "errorRate": 0.5
        }
        
        metrics = {
            "cpu": {
                "current": 1.2,
                "limit": 2.0,
                "unit": "cores"
            },
            "memory": {
                "current": 512,
                "limit": 1024,
                "unit": "Mi"
            },
            "network": {
                "bytesIn": 1024 * 1024 * 1024,
                "bytesOut": 512 * 1024 * 1024
            },
            "requests": {
                "total": 1500000,
                "perSecond": 25.5,
                "errors": 7500
            }
        }
        
        application_doc = {
            "id": app_id,
            "name": app_data["name"],
            "description": app_data["description"],
            "status": "Running",
            "replicas": app_data["replicas"],
            "created": current_time,
            "updated": current_time,
            "namespace": app_data["namespace"],
            "image": app_data["image"],
            "version": app_data["version"],
            "environment": app_data["environment"],
            "health": health_status,
            "metrics": metrics,
            "resources": {
                "cpu": {"request": "500m", "limit": "2"},
                "memory": {"request": "256Mi", "limit": "1Gi"},
                "storage": {"size": "10Gi", "type": "SSD"}
            },
            "logs": [],
            "vulnerabilities": [],
            "tags": app_data["tags"],
            "owner": app_data["owner"],
            "team": app_data["team"]
        }
        
        applications_db[app_id] = application_doc

# Seed data on startup
seed_initial_data() 