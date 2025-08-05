from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import asyncio

from .models import Application, ApplicationCreate, ApplicationUpdate
from .services import ApplicationService

app = FastAPI(title="Cloud Native App Orchestrator API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
application_service = ApplicationService()

@app.get("/")
def read_root():
    return {"message": "Cloud Native App Orchestrator API", "version": "1.0.0"}

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

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Cloud Native App Orchestrator API"}
