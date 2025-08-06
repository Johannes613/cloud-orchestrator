export interface Repository {
  id: string;
  name: string;
  url: string;
  branch: string;
  autoDeploy: boolean;
  status: 'Active' | 'Inactive' | 'Error' | 'Syncing';
  lastDeployed: string;
  environment: string;
  namespace: string;
  path: string;
  syncInterval: number;
  lastSync: string;
  commitCount: number;
  deploymentCount: number;
  created: string;
  updated: string;
}

export interface DeploymentHistory {
  id: string;
  repositoryId: string;
  repositoryName: string;
  commitHash: string;
  commitMessage: string;
  branch: string;
  author: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending' | 'running';
  duration: number;
  environment: string;
  namespace: string;
  resources: {
    deployments: number;
    services: number;
    configMaps: number;
    secrets: number;
  };
  logs?: string[];
  created: string;
}

export interface CreateRepositoryData {
  name: string;
  url: string;
  branch?: string;
  autoDeploy?: boolean;
  environment?: string;
  namespace?: string;
  path?: string;
  syncInterval?: number;
}

export interface UpdateRepositoryData {
  name?: string;
  url?: string;
  branch?: string;
  autoDeploy?: boolean;
  environment?: string;
  namespace?: string;
  path?: string;
  syncInterval?: number;
}

export interface CreateDeploymentHistoryData {
  repositoryId: string;
  repositoryName: string;
  commitHash: string;
  commitMessage: string;
  branch?: string;
  author?: string;
  status?: string;
  duration?: number;
  environment?: string;
  namespace?: string;
  resources?: {
    deployments: number;
    services: number;
    configMaps: number;
    secrets: number;
  };
  logs?: string[];
} 