from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
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
from models.gitops import (
    Repository, RepositoryCreate, RepositoryUpdate, 
    GitOpsDeployment, GitOpsDeploymentCreate, GitOpsDeploymentUpdate,
    GitOpsMetrics, DeploymentFilter, ManualDeployRequest
)
from models.cluster import Cluster, ClusterCreate, ClusterUpdate, ClusterMetrics
from models.logs import LogEntry, LogEntryCreate, LogFilter
from services.application_service import ApplicationService
from services.deployment_service import DeploymentService
from services.gitops_service import GitOpsService
from services.cluster_service import ClusterService
from services.logs_service import LogsService
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
gitops_service = GitOpsService()
cluster_service = ClusterService()
logs_service = LogsService()

@app.on_event("startup")
async def startup_event():
    """Initialize data on startup"""
    try:
        await seed_initial_data()
        
        # Recalculate deployment counts for clusters
        try:
            await cluster_service.recalculate_deployment_counts()
            print("✅ Deployment counts recalculated")
        except Exception as e:
            print(f"⚠️ Error recalculating deployment counts: {e}")
        
        # Sync GitOps with main deployments
        try:
            await gitops_service.sync_with_main_deployments()
            print("✅ GitOps synchronized with main deployments")
        except Exception as e:
            print(f"⚠️ Error syncing GitOps: {e}")
        
        print("✅ Application started successfully")
    except Exception as e:
        print(f"❌ Error during startup: {e}")

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

@app.get("/api/applications/gitops/connected")
async def get_applications_with_gitops():
    """Get all applications that have GitOps repositories connected"""
    try:
        applications = await application_service.get_all_applications()
        
        # Filter applications with GitOps connections
        connected_applications = [
            app for app in applications 
            if app.gitops and app.gitops.repository_id
        ]
        
        return {
            "connected_applications": connected_applications,
            "total_connected": len(connected_applications),
            "total_applications": len(applications)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching applications with GitOps: {str(e)}")

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

# GitOps endpoints
@app.get("/api/gitops/repositories", response_model=List[Repository])
async def get_gitops_repositories():
    """Get all GitOps repositories"""
    try:
        repositories = await gitops_service.get_all_repositories()
        return repositories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching repositories: {str(e)}")

@app.get("/api/gitops/repositories/{repo_id}", response_model=Repository)
async def get_gitops_repository(repo_id: str):
    """Get a specific GitOps repository by ID"""
    try:
        repository = await gitops_service.get_repository_by_id(repo_id)
        if not repository:
            raise HTTPException(status_code=404, detail="Repository not found")
        return repository
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching repository: {str(e)}")

@app.post("/api/gitops/repositories", response_model=Repository)
async def create_gitops_repository(repo_data: RepositoryCreate):
    """Create a new GitOps repository"""
    try:
        repository = await gitops_service.create_repository(repo_data)
        if not repository:
            raise HTTPException(status_code=500, detail="Failed to create repository")
        return repository
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating repository: {str(e)}")

@app.put("/api/gitops/repositories/{repo_id}", response_model=Repository)
async def update_gitops_repository(repo_id: str, repo_data: RepositoryUpdate):
    """Update an existing GitOps repository"""
    try:
        repository = await gitops_service.update_repository(repo_id, repo_data)
        if not repository:
            raise HTTPException(status_code=404, detail="Repository not found")
        return repository
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating repository: {str(e)}")

@app.delete("/api/gitops/repositories/{repo_id}")
async def delete_gitops_repository(repo_id: str):
    """Delete a GitOps repository"""
    try:
        success = await gitops_service.delete_repository(repo_id)
        if not success:
            raise HTTPException(status_code=404, detail="Repository not found")
        return {"message": "Repository deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting repository: {str(e)}")

@app.get("/api/gitops/deployments", response_model=List[GitOpsDeployment])
async def get_gitops_deployments():
    """Get all GitOps deployments"""
    try:
        deployments = await gitops_service.get_all_gitops_deployments()
        return deployments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching GitOps deployments: {str(e)}")

@app.get("/api/gitops/deployments/{deployment_id}", response_model=GitOpsDeployment)
async def get_gitops_deployment(deployment_id: str):
    """Get a specific GitOps deployment by ID"""
    try:
        deployment = await gitops_service.get_gitops_deployment_by_id(deployment_id)
        if not deployment:
            raise HTTPException(status_code=404, detail="GitOps deployment not found")
        return deployment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching GitOps deployment: {str(e)}")

@app.post("/api/gitops/deployments", response_model=GitOpsDeployment)
async def create_gitops_deployment(deployment_data: GitOpsDeploymentCreate):
    """Create a new GitOps deployment"""
    try:
        deployment = await gitops_service.create_gitops_deployment(deployment_data)
        if not deployment:
            raise HTTPException(status_code=500, detail="Failed to create GitOps deployment")
        return deployment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating GitOps deployment: {str(e)}")

@app.put("/api/gitops/deployments/{deployment_id}", response_model=GitOpsDeployment)
async def update_gitops_deployment(deployment_id: str, deployment_data: GitOpsDeploymentUpdate):
    """Update an existing GitOps deployment"""
    try:
        deployment = await gitops_service.update_gitops_deployment(deployment_id, deployment_data)
        if not deployment:
            raise HTTPException(status_code=404, detail="GitOps deployment not found")
        return deployment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating GitOps deployment: {str(e)}")

@app.delete("/api/gitops/deployments/{deployment_id}")
async def delete_gitops_deployment(deployment_id: str):
    """Delete a GitOps deployment"""
    try:
        success = await gitops_service.delete_gitops_deployment(deployment_id)
        if not success:
            raise HTTPException(status_code=404, detail="GitOps deployment not found")
        return {"message": "GitOps deployment deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting GitOps deployment: {str(e)}")

# Enhanced GitOps endpoints
@app.get("/api/gitops/metrics", response_model=GitOpsMetrics)
async def get_gitops_metrics():
    """Get GitOps metrics and statistics"""
    try:
        metrics = await gitops_service.get_gitops_metrics()
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching GitOps metrics: {str(e)}")

@app.get("/api/gitops/deployments/history", response_model=List[GitOpsDeployment])
async def get_deployment_history(
    repository_id: Optional[str] = None,
    status: Optional[str] = None,
    environment: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: Optional[int] = 50
):
    """Get deployment history with optional filtering"""
    try:
        deployment_filter = DeploymentFilter(
            repository_id=repository_id,
            status=status,
            environment=environment,
            start_date=start_date,
            end_date=end_date,
            limit=limit
        )
        deployments = await gitops_service.get_deployment_history(deployment_filter)
        return deployments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching deployment history: {str(e)}")

@app.post("/api/gitops/deployments/manual", response_model=GitOpsDeployment)
async def trigger_manual_deployment(deploy_request: ManualDeployRequest):
    """Trigger a manual deployment"""
    try:
        deployment = await gitops_service.trigger_manual_deployment(deploy_request)
        if not deployment:
            raise HTTPException(status_code=404, detail="Repository not found")
        return deployment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error triggering manual deployment: {str(e)}")

@app.post("/api/gitops/repositories/{repository_id}/sync")
async def sync_repository(repository_id: str):
    """Sync a repository"""
    try:
        success = await gitops_service.sync_repository(repository_id)
        if not success:
            raise HTTPException(status_code=404, detail="Repository not found")
        return {"message": "Repository sync initiated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error syncing repository: {str(e)}")

@app.get("/api/gitops/repositories/{repository_id}/deployments", response_model=List[GitOpsDeployment])
async def get_repository_deployments(repository_id: str):
    """Get all deployments for a specific repository"""
    try:
        deployments = await gitops_service.get_repository_deployments(repository_id)
        return deployments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching repository deployments: {str(e)}")

@app.put("/api/gitops/deployments/{deployment_id}/status")
async def update_deployment_status(
    deployment_id: str, 
    status: str, 
    duration: Optional[int] = None
):
    """Update deployment status and duration"""
    try:
        success = await gitops_service.update_deployment_status(deployment_id, status, duration)
        if not success:
            raise HTTPException(status_code=404, detail="Deployment not found")
        return {"message": "Deployment status updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating deployment status: {str(e)}")

# Webhook endpoint for Git events (simulated)
@app.post("/api/gitops/webhook")
async def git_webhook(webhook_data: dict):
    """Handle Git webhook events"""
    try:
        # Simulate webhook processing
        # In a real implementation, this would process GitHub/GitLab webhooks
        print(f"Received webhook: {webhook_data}")
        
        # Extract repository and commit info
        repo_name = webhook_data.get("repository", {}).get("name", "unknown")
        commit_hash = webhook_data.get("head_commit", {}).get("id", "unknown")
        branch = webhook_data.get("ref", "refs/heads/main").replace("refs/heads/", "")
        
        # Find repository by name
        repositories = await gitops_service.get_all_repositories()
        target_repo = None
        for repo in repositories:
            if repo.name == repo_name:
                target_repo = repo
                break
        
        if target_repo:
            # Create deployment record
            deploy_request = ManualDeployRequest(
                repository_id=target_repo.id,
                commit_hash=commit_hash,
                branch=branch,
                description=f"Webhook triggered deployment for {repo_name}",
                triggered_by="webhook"
            )
            
            deployment = await gitops_service.trigger_manual_deployment(deploy_request)
            if deployment:
                return {"message": "Webhook processed successfully", "deployment_id": deployment.id}
        
        return {"message": "Webhook received but no matching repository found"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing webhook: {str(e)}")

# Cluster endpoints
@app.get("/api/clusters", response_model=List[Cluster])
async def get_clusters():
    """Get all clusters"""
    try:
        clusters = await cluster_service.get_all_clusters()
        return clusters
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching clusters: {str(e)}")

@app.get("/api/clusters/{cluster_id}", response_model=Cluster)
async def get_cluster(cluster_id: str):
    """Get a specific cluster by ID"""
    try:
        cluster = await cluster_service.get_cluster_by_id(cluster_id)
        if not cluster:
            raise HTTPException(status_code=404, detail="Cluster not found")
        return cluster
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cluster: {str(e)}")

@app.post("/api/clusters", response_model=Cluster)
async def create_cluster(cluster_data: ClusterCreate):
    """Create a new cluster"""
    try:
        cluster = await cluster_service.create_cluster(cluster_data)
        if not cluster:
            raise HTTPException(status_code=500, detail="Failed to create cluster")
        return cluster
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating cluster: {str(e)}")

@app.put("/api/clusters/{cluster_id}", response_model=Cluster)
async def update_cluster(cluster_id: str, cluster_data: ClusterUpdate):
    """Update an existing cluster"""
    try:
        cluster = await cluster_service.update_cluster(cluster_id, cluster_data)
        if not cluster:
            raise HTTPException(status_code=404, detail="Cluster not found")
        return cluster
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating cluster: {str(e)}")

@app.delete("/api/clusters/{cluster_id}")
async def delete_cluster(cluster_id: str):
    """Delete a cluster"""
    try:
        success = await cluster_service.delete_cluster(cluster_id)
        if not success:
            raise HTTPException(status_code=404, detail="Cluster not found")
        return {"message": "Cluster deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting cluster: {str(e)}")

@app.put("/api/clusters/{cluster_id}/metrics")
async def update_cluster_metrics(cluster_id: str, metrics: ClusterMetrics):
    """Update cluster metrics"""
    try:
        success = await cluster_service.update_cluster_metrics(cluster_id, metrics)
        if not success:
            raise HTTPException(status_code=404, detail="Cluster not found")
        return {"message": "Cluster metrics updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating cluster metrics: {str(e)}")

# Logs endpoints
@app.get("/api/logs", response_model=List[LogEntry])
async def get_logs(
    level: Optional[str] = None,
    source: Optional[str] = None,
    application_id: Optional[str] = None,
    deployment_id: Optional[str] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    limit: Optional[int] = 100
):
    """Get logs with optional filtering"""
    try:
        log_filter = LogFilter(
            level=level,
            source=source,
            application_id=application_id,
            deployment_id=deployment_id,
            start_time=start_time,
            end_time=end_time,
            limit=limit
        )
        logs = await logs_service.get_logs(log_filter)
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching logs: {str(e)}")

@app.get("/api/logs/{log_id}", response_model=LogEntry)
async def get_log(log_id: str):
    """Get a specific log entry by ID"""
    try:
        log_entry = await logs_service.get_log_by_id(log_id)
        if not log_entry:
            raise HTTPException(status_code=404, detail="Log entry not found")
        return log_entry
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching log: {str(e)}")

@app.post("/api/logs", response_model=LogEntry)
async def create_log(log_data: LogEntryCreate):
    """Create a new log entry"""
    try:
        log_entry = await logs_service.create_log(log_data)
        if not log_entry:
            raise HTTPException(status_code=500, detail="Failed to create log entry")
        return log_entry
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating log entry: {str(e)}")

@app.delete("/api/logs/{log_id}")
async def delete_log(log_id: str):
    """Delete a log entry"""
    try:
        success = await logs_service.delete_log(log_id)
        if not success:
            raise HTTPException(status_code=404, detail="Log entry not found")
        return {"message": "Log entry deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting log entry: {str(e)}")

@app.delete("/api/logs")
async def clear_logs(
    level: Optional[str] = None,
    source: Optional[str] = None,
    application_id: Optional[str] = None,
    deployment_id: Optional[str] = None
):
    """Clear logs with optional filtering"""
    try:
        log_filter = LogFilter(
            level=level,
            source=source,
            application_id=application_id,
            deployment_id=deployment_id
        )
        success = await logs_service.clear_logs(log_filter)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to clear logs")
        return {"message": "Logs cleared successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing logs: {str(e)}")

# New endpoints for connecting deployments with clusters
@app.get("/api/deployments/cluster/{cluster_id}", response_model=List[Deployment])
async def get_deployments_by_cluster(cluster_id: str):
    """Get all deployments for a specific cluster"""
    try:
        deployments = await deployment_service.get_deployments_by_cluster(cluster_id)
        return deployments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cluster deployments: {str(e)}")

@app.get("/api/deployments/application/{application_id}", response_model=List[Deployment])
async def get_deployments_by_application(application_id: str):
    """Get all deployments for a specific application"""
    try:
        deployments = await deployment_service.get_deployments_by_application(application_id)
        return deployments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching application deployments: {str(e)}")

# New endpoints for connecting logs with applications
@app.get("/api/logs/application/{application_id}", response_model=List[LogEntry])
async def get_logs_by_application(
    application_id: str,
    level: Optional[str] = None,
    source: Optional[str] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    limit: Optional[int] = 100
):
    """Get logs for a specific application with optional filtering"""
    try:
        log_filter = LogFilter(
            level=level,
            source=source,
            application_id=application_id,
            start_time=start_time,
            end_time=end_time,
            limit=limit
        )
        logs = await logs_service.get_logs(log_filter)
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching application logs: {str(e)}")

@app.get("/api/logs/deployment/{deployment_id}", response_model=List[LogEntry])
async def get_logs_by_deployment(
    deployment_id: str,
    level: Optional[str] = None,
    source: Optional[str] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    limit: Optional[int] = 100
):
    """Get logs for a specific deployment with optional filtering"""
    try:
        log_filter = LogFilter(
            level=level,
            source=source,
            deployment_id=deployment_id,
            start_time=start_time,
            end_time=end_time,
            limit=limit
        )
        logs = await logs_service.get_logs(log_filter)
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching deployment logs: {str(e)}")

# Endpoint to recalculate deployment counts in clusters
@app.post("/api/clusters/recalculate-deployment-counts")
async def recalculate_cluster_deployment_counts():
    """Recalculate deployment counts for all clusters"""
    try:
        await cluster_service.recalculate_deployment_counts()
        return {"message": "Deployment counts recalculated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error recalculating deployment counts: {str(e)}")

# Enhanced cluster endpoint to include deployment information
@app.get("/api/clusters/{cluster_id}/with-deployments")
async def get_cluster_with_deployments(cluster_id: str):
    """Get cluster details with its deployments"""
    try:
        cluster = await cluster_service.get_cluster_by_id(cluster_id)
        if not cluster:
            raise HTTPException(status_code=404, detail="Cluster not found")
        
        deployments = await deployment_service.get_deployments_by_cluster(cluster_id)
        
        return {
            "cluster": cluster,
            "deployments": deployments,
            "deployment_count": len(deployments)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cluster with deployments: {str(e)}")

# Enhanced application endpoint to include logs
@app.get("/api/applications/{application_id}/with-logs")
async def get_application_with_logs(
    application_id: str,
    log_limit: Optional[int] = 50
):
    """Get application details with its recent logs"""
    try:
        application = await application_service.get_application_by_id(application_id)
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        log_filter = LogFilter(
            application_id=application_id,
            limit=log_limit
        )
        logs = await logs_service.get_logs(log_filter)
        
        return {
            "application": application,
            "recent_logs": logs,
            "log_count": len(logs)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching application with logs: {str(e)}")

# GitOps synchronization endpoints
@app.post("/api/gitops/sync-deployment-counts")
async def sync_gitops_deployment_counts():
    """Sync GitOps deployment counts with main deployments"""
    try:
        await gitops_service.sync_with_main_deployments()
        return {"message": "GitOps deployment counts synchronized successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error syncing GitOps deployment counts: {str(e)}")

@app.post("/api/gitops/recalculate-deployment-counts")
async def recalculate_gitops_deployment_counts():
    """Recalculate GitOps deployment counts"""
    try:
        await gitops_service.recalculate_deployment_counts()
        return {"message": "GitOps deployment counts recalculated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error recalculating GitOps deployment counts: {str(e)}")

@app.get("/api/gitops/deployment-counts")
async def get_gitops_deployment_counts():
    """Get current GitOps deployment counts for all repositories"""
    try:
        repositories = await gitops_service.get_all_repositories()
        counts = {}
        for repo in repositories:
            counts[repo.id] = {
                "repository_name": repo.name,
                "deployment_count": repo.deploymentCount
            }
        return counts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching GitOps deployment counts: {str(e)}")

@app.get("/api/gitops/sync-status")
async def get_gitops_sync_status():
    """Get GitOps sync status and compare with main deployments"""
    try:
        # Get GitOps repositories
        gitops_repos = await gitops_service.get_all_repositories()
        
        # Get main deployment count
        main_deployments = await deployment_service.get_all_deployments()
        main_deployment_count = len(main_deployments)
        
        # Calculate GitOps total deployment count
        gitops_total_count = sum(repo.deploymentCount for repo in gitops_repos)
        
        return {
            "main_deployment_count": main_deployment_count,
            "gitops_total_deployment_count": gitops_total_count,
            "is_synchronized": main_deployment_count == gitops_total_count,
            "repositories": [
                {
                    "id": repo.id,
                    "name": repo.name,
                    "deployment_count": repo.deploymentCount
                }
                for repo in gitops_repos
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching GitOps sync status: {str(e)}")

# GitOps-Application connection endpoints
@app.get("/api/applications/{application_id}/gitops")
async def get_application_gitops(application_id: str):
    """Get GitOps information for a specific application"""
    try:
        application = await application_service.get_application_by_id(application_id)
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        if not application.gitops or not application.gitops.repository_id:
            return {"message": "No GitOps repository connected to this application"}
        
        # Get GitOps repository details
        repository = await gitops_service.get_repository_by_id(application.gitops.repository_id)
        if not repository:
            return {"message": "Connected GitOps repository not found"}
        
        # Get deployments for this repository
        deployments = await gitops_service.get_repository_deployments(application.gitops.repository_id)
        
        return {
            "application_id": application_id,
            "application_name": application.name,
            "gitops_repository": repository,
            "deployments": deployments,
            "deployment_count": len(deployments),
            "last_deployment": application.gitops.last_deployment,
            "sync_status": application.gitops.sync_status
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching application GitOps info: {str(e)}")

@app.post("/api/applications/{application_id}/gitops/connect")
async def connect_application_to_gitops(application_id: str, repository_id: str):
    """Connect an application to a GitOps repository"""
    try:
        # Check if application exists
        application = await application_service.get_application_by_id(application_id)
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Check if repository exists
        repository = await gitops_service.get_repository_by_id(repository_id)
        if not repository:
            raise HTTPException(status_code=404, detail="GitOps repository not found")
        
        # Update application with GitOps info
        gitops_info = {
            "repository_id": repository_id,
            "repository_name": repository.name,
            "branch": repository.branch,
            "auto_deploy": repository.autoDeploy,
            "deployment_count": repository.deploymentCount,
            "sync_status": "synced"
        }
        
        updated_application = await application_service.update_application(
            application_id, 
            ApplicationUpdate(gitops=gitops_info)
        )
        
        if not updated_application:
            raise HTTPException(status_code=500, detail="Failed to update application")
        
        return {
            "message": "Application connected to GitOps repository successfully",
            "application": updated_application,
            "repository": repository
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error connecting application to GitOps: {str(e)}")

@app.delete("/api/applications/{application_id}/gitops/disconnect")
async def disconnect_application_from_gitops(application_id: str):
    """Disconnect an application from its GitOps repository"""
    try:
        # Check if application exists
        application = await application_service.get_application_by_id(application_id)
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        if not application.gitops or not application.gitops.repository_id:
            raise HTTPException(status_code=400, detail="Application is not connected to any GitOps repository")
        
        # Remove GitOps connection
        updated_application = await application_service.update_application(
            application_id, 
            ApplicationUpdate(gitops=None)
        )
        
        if not updated_application:
            raise HTTPException(status_code=500, detail="Failed to update application")
        
        return {
            "message": "Application disconnected from GitOps repository successfully",
            "application": updated_application
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error disconnecting application from GitOps: {str(e)}")

@app.get("/api/gitops/repositories/{repository_id}/applications")
async def get_repository_applications(repository_id: str):
    """Get all applications connected to a specific GitOps repository"""
    try:
        # Check if repository exists
        repository = await gitops_service.get_repository_by_id(repository_id)
        if not repository:
            raise HTTPException(status_code=404, detail="GitOps repository not found")
        
        # Get all applications
        applications = await application_service.get_all_applications()
        
        # Filter applications connected to this repository
        connected_applications = [
            app for app in applications 
            if app.gitops and app.gitops.repository_id == repository_id
        ]
        
        return {
            "repository": repository,
            "connected_applications": connected_applications,
            "application_count": len(connected_applications)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching repository applications: {str(e)}")

@app.get("/api/applications/gitops/connected")
async def get_applications_with_gitops():
    """Get all applications that have GitOps repositories connected"""
    try:
        applications = await application_service.get_all_applications()
        
        # Filter applications with GitOps connections
        connected_applications = [
            app for app in applications 
            if app.gitops and app.gitops.repository_id
        ]
        
        return {
            "connected_applications": connected_applications,
            "total_connected": len(connected_applications),
            "total_applications": len(applications)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching applications with GitOps: {str(e)}") 