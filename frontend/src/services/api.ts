import type { Application } from '../types/application';

const API_BASE_URL = 'http://localhost:8000/api';

export interface CreateApplicationData {
  name: string;
  description: string;
  namespace: string;
  image: string;
  version: string;
  environment: string;
  replicas: number;
  resources: {
    cpu: {
      request: string;
      limit: string;
    };
    memory: {
      request: string;
      limit: string;
    };
    storage: {
      size: string;
      type: string;
    };
  };
  tags: string[];
  owner: string;
  team: string;
}

export interface UpdateApplicationData {
  name?: string;
  description?: string;
  status?: string;
  replicas?: number;
  version?: string;
  environment?: string;
  tags?: string[];
  owner?: string;
  team?: string;
}

class ApiService {
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
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Applications
  async getApplications(): Promise<Application[]> {
    return this.request<Application[]>('/applications');
  }

  async getApplication(id: string): Promise<Application> {
    return this.request<Application>(`/applications/${id}`);
  }

  async createApplication(data: CreateApplicationData): Promise<Application> {
    return this.request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateApplication(id: string, data: UpdateApplicationData): Promise<Application> {
    return this.request<Application>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteApplication(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  // Metrics
  async updateApplicationMetrics(id: string, metrics: any): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${id}/metrics`, {
      method: 'PUT',
      body: JSON.stringify(metrics),
    });
  }

  // Health
  async updateApplicationHealth(id: string, health: any): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${id}/health`, {
      method: 'PUT',
      body: JSON.stringify(health),
    });
  }

  // Logs
  async addApplicationLog(id: string, logData: {
    level: string;
    source: string;
    message: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${id}/logs`, {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  // Vulnerabilities
  async addApplicationVulnerability(id: string, vulnerabilityData: {
    severity: string;
    title: string;
    description: string;
    cve: string;
    cvss: number;
    package: string;
    version: string;
    fixedIn: string;
    discovered: string;
    status: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/applications/${id}/vulnerabilities`, {
      method: 'POST',
      body: JSON.stringify(vulnerabilityData),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request<{ status: string; service: string }>('/health');
  }
}

export const apiService = new ApiService(); 