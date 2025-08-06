import type { Deployment } from '../types/deployment';

const API_BASE_URL = 'http://localhost:8000/api';

export interface CreateDeploymentData {
  application_id: string;
  version: string;
  environment: string;
  commit_hash: string;
  description?: string;
  triggered_by?: string;
  deployment_strategy?: string;
  replicas?: number;
  resources?: {
    cpu: {
      request: string;
      limit: string;
    };
    memory: {
      request: string;
      limit: string;
    };
  };
}

export interface UpdateDeploymentData {
  version?: string;
  status?: string;
  environment?: string;
  description?: string;
  duration?: number;
}

class DeploymentApiService {
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
      console.error('Deployment API request failed:', error);
      throw error;
    }
  }

  // Deployments
  async getDeployments(): Promise<Deployment[]> {
    return this.request<Deployment[]>('/deployments');
  }

  async getDeployment(id: string): Promise<Deployment> {
    return this.request<Deployment>(`/deployments/${id}`);
  }

  async createDeployment(data: CreateDeploymentData): Promise<Deployment> {
    return this.request<Deployment>('/deployments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDeployment(id: string, data: UpdateDeploymentData): Promise<Deployment> {
    return this.request<Deployment>(`/deployments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDeployment(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/deployments/${id}`, {
      method: 'DELETE',
    });
  }

  async rollbackDeployment(id: string): Promise<{ message: string; rollback_id: string }> {
    return this.request<{ message: string; rollback_id: string }>(`/deployments/${id}/rollback`, {
      method: 'POST',
    });
  }
}

export const deploymentApiService = new DeploymentApiService(); 