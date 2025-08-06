const API_BASE_URL = 'http://localhost:8000/api';

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

class GitOpsApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GitOps API request failed:', error);
      throw error;
    }
  }

  // Repository endpoints
  async getRepositories(): Promise<Repository[]> {
    return this.request<Repository[]>('/gitops/repositories');
  }

  async createRepository(data: CreateRepositoryData): Promise<Repository> {
    return this.request<Repository>('/gitops/repositories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRepository(id: string, data: UpdateRepositoryData): Promise<Repository> {
    return this.request<Repository>(`/gitops/repositories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRepository(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/gitops/repositories/${id}`, {
      method: 'DELETE',
    });
  }

  async syncRepository(id: string): Promise<{ message: string; repository: Repository }> {
    return this.request<{ message: string; repository: Repository }>(`/gitops/repositories/${id}/sync`, {
      method: 'POST',
    });
  }

  // Deployment history endpoints
  async getDeploymentHistory(): Promise<DeploymentHistory[]> {
    return this.request<DeploymentHistory[]>('/gitops/deployments');
  }

  async createDeploymentHistory(data: CreateDeploymentHistoryData): Promise<DeploymentHistory> {
    return this.request<DeploymentHistory>('/gitops/deployments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const gitopsApiService = new GitOpsApiService(); 