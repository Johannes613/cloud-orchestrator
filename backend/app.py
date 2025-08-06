from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import json
from datetime import datetime
import uuid
import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our modules
from models.application import Application, ApplicationCreate, ApplicationUpdate
from models.deployment import Deployment, DeploymentCreate, DeploymentUpdate
from services.application_service import ApplicationService
from services.deployment_service import DeploymentService
from utils.seed_data import seed_initial_data

app = FastAPI(title="Cloud Native App Orchestrator API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
application_service = ApplicationService()
deployment_service = DeploymentService()

@app.on_event("startup")
async def startup_event():
    """Initialize data on startup"""
    seed_initial_data()

@app.get("/")
def read_root():
    return {"message": "Cloud Native App Orchestrator API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Cloud Native App Orchestrator API"}

# Application endpoints
@app.get("/api/applications", response_model=List[Application])
async def get_applications():
    """Get all applications"""
    try:
        applications = await application_service.get_all_applications()
        return applications
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching applications: {str(e)}")

@app.get("/api/applications/{app_id}", response_model=Application)
async def get_application(app_id: str):
    """Get a specific application by ID"""
    try:
        application = await application_service.get_application_by_id(app_id)
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        return application
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching application: {str(e)}")

@app.post("/api/applications", response_model=Application)
async def create_application(app_data: ApplicationCreate):
    """Create a new application"""
    try:
        application = await application_service.create_application(app_data)
        if not application:
            raise HTTPException(status_code=500, detail="Failed to create application")
        return application
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating application: {str(e)}")

@app.put("/api/applications/{app_id}", response_model=Application)
async def update_application(app_id: str, app_data: ApplicationUpdate):
    """Update an existing application"""
    try:
        application = await application_service.update_application(app_id, app_data)
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        return application
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating application: {str(e)}")

@app.delete("/api/applications/{app_id}")
async def delete_application(app_id: str):
    """Delete an application"""
    try:
        success = await application_service.delete_application(app_id)
        if not success:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"message": "Application deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting application: {str(e)}")

@app.put("/api/applications/{app_id}/metrics")
async def update_application_metrics(app_id: str, metrics: dict):
    """Update application metrics"""
    try:
        success = await application_service.update_application_metrics(app_id, metrics)
        if not success:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"message": "Metrics updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating metrics: {str(e)}")

@app.put("/api/applications/{app_id}/health")
async def update_application_health(app_id: str, health: dict):
    """Update application health status"""
    try:
        success = await application_service.update_application_health(app_id, health)
        if not success:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"message": "Health status updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating health: {str(e)}")

@app.post("/api/applications/{app_id}/logs")
async def add_application_log(app_id: str, log_data: dict):
    """Add a log entry to an application"""
    try:
        success = await application_service.add_application_log(app_id, log_data)
        if not success:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"message": "Log entry added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding log: {str(e)}")

@app.post("/api/applications/{app_id}/vulnerabilities")
async def add_application_vulnerability(app_id: str, vulnerability_data: dict):
    """Add a vulnerability to an application"""
    try:
        success = await application_service.add_application_vulnerability(app_id, vulnerability_data)
        if not success:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"message": "Vulnerability added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding vulnerability: {str(e)}")

# Deployment endpoints
@app.get("/api/deployments", response_model=List[Deployment])
async def get_deployments():
    """Get all deployments"""
    try:
        deployments = await deployment_service.get_all_deployments()
        return deployments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching deployments: {str(e)}")

@app.get("/api/deployments/{deployment_id}", response_model=Deployment)
async def get_deployment(deployment_id: str):
    """Get a specific deployment by ID"""
    try:
        deployment = await deployment_service.get_deployment_by_id(deployment_id)
        if not deployment:
            raise HTTPException(status_code=404, detail="Deployment not found")
        return deployment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching deployment: {str(e)}")

@app.post("/api/deployments", response_model=Deployment)
async def create_deployment(deployment_data: DeploymentCreate):
    """Create a new deployment"""
    try:
        deployment = await deployment_service.create_deployment(deployment_data)
        if not deployment:
            raise HTTPException(status_code=500, detail="Failed to create deployment")
        return deployment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating deployment: {str(e)}")

@app.put("/api/deployments/{deployment_id}", response_model=Deployment)
async def update_deployment(deployment_id: str, deployment_data: DeploymentUpdate):
    """Update an existing deployment"""
    try:
        deployment = await deployment_service.update_deployment(deployment_id, deployment_data)
        if not deployment:
            raise HTTPException(status_code=404, detail="Deployment not found")
        return deployment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating deployment: {str(e)}")

@app.delete("/api/deployments/{deployment_id}")
async def delete_deployment(deployment_id: str):
    """Delete a deployment"""
    try:
        success = await deployment_service.delete_deployment(deployment_id)
        if not success:
            raise HTTPException(status_code=404, detail="Deployment not found")
        return {"message": "Deployment deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting deployment: {str(e)}")

@app.post("/api/deployments/{deployment_id}/rollback")
async def rollback_deployment(deployment_id: str):
    """Rollback a deployment"""
    try:
        rollback_deployment = await deployment_service.rollback_deployment(deployment_id)
        if not rollback_deployment:
            raise HTTPException(status_code=404, detail="Deployment not found")
        return {
            "message": "Rollback initiated successfully",
            "rollback_id": rollback_deployment.id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error rolling back deployment: {str(e)}") 