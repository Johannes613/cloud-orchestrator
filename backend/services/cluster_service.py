from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import json
import os
from models.cluster import Cluster, ClusterCreate, ClusterUpdate, ClusterMetrics

class ClusterService:
    def __init__(self):
        self.clusters = {}
        self.data_file = "data/clusters.json"
        self._load_data()

    def _load_data(self):
        """Load clusters from JSON file"""
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        self.clusters = {item['id']: item for item in data}
                    else:
                        self.clusters = data
        except Exception as e:
            print(f"Error loading cluster data: {e}")
            self.clusters = {}

    def _save_data(self):
        """Save clusters to JSON file"""
        try:
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            with open(self.data_file, 'w') as f:
                json.dump(list(self.clusters.values()), f, indent=2)
        except Exception as e:
            print(f"Error saving cluster data: {e}")

    async def get_all_clusters(self) -> List[Cluster]:
        """Get all clusters"""
        try:
            return [Cluster(**cluster_data) for cluster_data in self.clusters.values()]
        except Exception as e:
            print(f"Error fetching clusters: {e}")
            return []

    async def get_cluster_by_id(self, cluster_id: str) -> Optional[Cluster]:
        """Get a specific cluster by ID"""
        try:
            if cluster_id in self.clusters:
                return Cluster(**self.clusters[cluster_id])
            return None
        except Exception as e:
            print(f"Error fetching cluster {cluster_id}: {e}")
            return None

    async def create_cluster(self, cluster_data: ClusterCreate) -> Optional[Cluster]:
        """Create a new cluster"""
        try:
            cluster_id = str(uuid.uuid4())
            current_time = datetime.now().isoformat()
            
            # Default metrics
            metrics = ClusterMetrics(
                cpu_usage=0.0,
                memory_usage=0.0,
                node_count=0,
                pod_count=0,
                namespace_count=0
            )
            
            cluster_doc = {
                "id": cluster_id,
                "name": cluster_data.name,
                "provider": cluster_data.provider,
                "region": cluster_data.region,
                "version": cluster_data.version,
                "status": "Active",
                "description": cluster_data.description,
                "environment": cluster_data.environment,
                "created": current_time,
                "updated": current_time,
                "last_health_check": current_time,
                "metrics": metrics.dict(),
                "node_count": 0,
                "pod_count": 0,
                "namespace_count": 0
            }
            
            self.clusters[cluster_id] = cluster_doc
            self._save_data()
            
            return Cluster(**cluster_doc)
        except Exception as e:
            print(f"Error creating cluster: {e}")
            return None

    async def update_cluster(self, cluster_id: str, cluster_data: ClusterUpdate) -> Optional[Cluster]:
        """Update an existing cluster"""
        try:
            if cluster_id not in self.clusters:
                return None
            
            current_cluster = self.clusters[cluster_id]
            current_time = datetime.now().isoformat()
            
            update_data = cluster_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                current_cluster[key] = value
            
            current_cluster['updated'] = current_time
            
            self._save_data()
            
            return Cluster(**current_cluster)
        except Exception as e:
            print(f"Error updating cluster {cluster_id}: {e}")
            return None

    async def delete_cluster(self, cluster_id: str) -> bool:
        """Delete a cluster"""
        try:
            if cluster_id in self.clusters:
                del self.clusters[cluster_id]
                self._save_data()
                return True
            return False
        except Exception as e:
            print(f"Error deleting cluster {cluster_id}: {e}")
            return False

    async def update_cluster_metrics(self, cluster_id: str, metrics: ClusterMetrics) -> bool:
        """Update cluster metrics"""
        try:
            if cluster_id in self.clusters:
                self.clusters[cluster_id]['metrics'] = metrics.dict()
                self.clusters[cluster_id]['node_count'] = metrics.node_count
                self.clusters[cluster_id]['pod_count'] = metrics.pod_count
                self.clusters[cluster_id]['namespace_count'] = metrics.namespace_count
                self.clusters[cluster_id]['updated'] = datetime.now().isoformat()
                self.clusters[cluster_id]['last_health_check'] = datetime.now().isoformat()
                self._save_data()
                return True
            return False
        except Exception as e:
            print(f"Error updating metrics for cluster {cluster_id}: {e}")
            return False 