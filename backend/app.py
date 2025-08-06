from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
import json
from datetime import datetime
import uuid
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.application import Application, ApplicationCreate, ApplicationUpdate
from models.deployment import Deployment, DeploymentCreate, DeploymentUpdate
from models.gitops import Repository, RepositoryCreate, RepositoryUpdate, GitOpsDeployment, GitOpsDeploymentCreate, GitOpsDeploymentUpdate
from models.cluster import Cluster, ClusterCreate, ClusterUpdate, ClusterMetrics
from models.logs import LogEntry, LogEntryCreate, LogFilter
from services.application_service import ApplicationService
from services.deployment_service import DeploymentService
from services.gitops_service import GitOpsService
from services.cluster_service import ClusterService
from services.logs_service import LogsService
from utils.seed_data import seed_initial_data

app = FastAPI(title="Cloud Native App Orchestrator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

application_service = ApplicationService()
deployment_service = DeploymentService()
gitops_service = GitOpsService()
cluster_service = ClusterService()
logs_service = LogsService()

@app.on_event("startup")
async def startup_event():
    await seed_initial_data()

@app.get("/")
def read_root():
    return {"message": "Cloud Native App Orchestrator API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Cloud Native App Orchestrator API"}

@app.get("/api/applications", response_model=List[Application])
async def get_applications():
    try:
        applications = await application_service.get_all_applications()
        return applications
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching applications: {str(e)}")

@app.get("/api/applications/{app_id}", response_model=Application)
async def get_application(app_id: str):
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
    try:
        success = await application_service.update_application_metrics(app_id, metrics)
        if not success:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"message": "Application metrics updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating application metrics: {str(e)}")

@app.put("/api/applications/{app_id}/health")
async def update_application_health(app_id: str, health: dict):
    try:
        success = await application_service.update_application_health(app_id, health)
        if not success:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"message": "Application health updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating application health: {str(e)}")

@app.post("/api/applications/{app_id}/logs")
async def add_application_log(app_id: str, log_data: dict):
    try:
        success = await application_service.add_application_log(app_id, log_data)
        if not success:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"message": "Log entry added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding log entry: {str(e)}")

@app.post("/api/applications/{app_id}/vulnerabilities")
async def add_application_vulnerability(app_id: str, vulnerability_data: dict):
    try:
        success = await application_service.add_application_vulnerability(app_id, vulnerability_data)
        if not success:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"message": "Vulnerability added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding vulnerability: {str(e)}")

@app.get("/api/deployments", response_model=List[Deployment])
async def get_deployments():
    try:
        deployments = await deployment_service.get_all_deployments()
        return deployments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching deployments: {str(e)}")

@app.get("/api/deployments/{deployment_id}", response_model=Deployment)
async def get_deployment(deployment_id: str):
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
    try:
        success = await deployment_service.rollback_deployment(deployment_id)
        if not success:
            raise HTTPException(status_code=404, detail="Deployment not found")
        return {"message": "Deployment rollback initiated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error rolling back deployment: {str(e)}")

@app.get("/api/gitops/repositories", response_model=List[Repository])
async def get_gitops_repositories():
    try:
        repositories = await gitops_service.get_all_repositories()
        return repositories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching GitOps repositories: {str(e)}")

@app.get("/api/gitops/repositories/{repo_id}", response_model=Repository)
async def get_gitops_repository(repo_id: str):
    try:
        repository = await gitops_service.get_repository_by_id(repo_id)
        if not repository:
            raise HTTPException(status_code=404, detail="GitOps repository not found")
        return repository
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching GitOps repository: {str(e)}")

@app.post("/api/gitops/repositories", response_model=Repository)
async def create_gitops_repository(repo_data: RepositoryCreate):
    try:
        repository = await gitops_service.create_repository(repo_data)
        if not repository:
            raise HTTPException(status_code=500, detail="Failed to create GitOps repository")
        return repository
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating GitOps repository: {str(e)}")

@app.put("/api/gitops/repositories/{repo_id}", response_model=Repository)
async def update_gitops_repository(repo_id: str, repo_data: RepositoryUpdate):
    try:
        repository = await gitops_service.update_repository(repo_id, repo_data)
        if not repository:
            raise HTTPException(status_code=404, detail="GitOps repository not found")
        return repository
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating GitOps repository: {str(e)}")

@app.delete("/api/gitops/repositories/{repo_id}")
async def delete_gitops_repository(repo_id: str):
    try:
        success = await gitops_service.delete_repository(repo_id)
        if not success:
            raise HTTPException(status_code=404, detail="GitOps repository not found")
        return {"message": "GitOps repository deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting GitOps repository: {str(e)}")

@app.get("/api/gitops/deployments", response_model=List[GitOpsDeployment])
async def get_gitops_deployments():
    try:
        deployments = await gitops_service.get_all_gitops_deployments()
        return deployments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching GitOps deployments: {str(e)}")

@app.get("/api/gitops/deployments/{deployment_id}", response_model=GitOpsDeployment)
async def get_gitops_deployment(deployment_id: str):
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
    try:
        success = await gitops_service.delete_gitops_deployment(deployment_id)
        if not success:
            raise HTTPException(status_code=404, detail="GitOps deployment not found")
        return {"message": "GitOps deployment deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting GitOps deployment: {str(e)}")

@app.get("/api/clusters", response_model=List[Cluster])
async def get_clusters():
    try:
        clusters = await cluster_service.get_all_clusters()
        return clusters
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching clusters: {str(e)}")

@app.get("/api/clusters/{cluster_id}", response_model=Cluster)
async def get_cluster(cluster_id: str):
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
    try:
        success = await cluster_service.update_cluster_metrics(cluster_id, metrics)
        if not success:
            raise HTTPException(status_code=404, detail="Cluster not found")
        return {"message": "Cluster metrics updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating cluster metrics: {str(e)}")

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
    try:
        logs = await logs_service.get_logs(
            level=level,
            source=source,
            application_id=application_id,
            deployment_id=deployment_id,
            start_time=start_time,
            end_time=end_time,
            limit=limit
        )
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching logs: {str(e)}")

@app.get("/api/logs/{log_id}", response_model=LogEntry)
async def get_log(log_id: str):
    try:
        log = await logs_service.get_log_by_id(log_id)
        if not log:
            raise HTTPException(status_code=404, detail="Log entry not found")
        return log
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching log: {str(e)}")

@app.post("/api/logs", response_model=LogEntry)
async def create_log(log_data: LogEntryCreate):
    try:
        log = await logs_service.create_log(log_data)
        if not log:
            raise HTTPException(status_code=500, detail="Failed to create log entry")
        return log
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating log entry: {str(e)}")

@app.delete("/api/logs/{log_id}")
async def delete_log(log_id: str):
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
    try:
        success = await logs_service.clear_logs(
            level=level,
            source=source,
            application_id=application_id,
            deployment_id=deployment_id
        )
        return {"message": "Logs cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing logs: {str(e)}")

 