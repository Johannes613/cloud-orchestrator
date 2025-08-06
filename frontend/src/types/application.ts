export interface Application {
    id: string;
    name: string;
    description?: string;
    status: ApplicationStatus;
    replicas: number;
    created: string;
    updated: string;
    namespace: string;
    image: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    health: ApplicationHealth;
    metrics: ApplicationMetrics;
    resources: ApplicationResources;
    logs: ApplicationLog[];
    vulnerabilities: Vulnerability[];
    tags: string[];
    owner: string;
    team: string;
}

export type ApplicationStatus = 'Running' | 'Deploying' | 'Failed' | 'Stopped' | 'Pending' | 'Archived';

export interface ApplicationHealth {
    status: 'healthy' | 'warning' | 'critical';
    lastCheck: string;
    uptime: number; // in seconds
    responseTime: number; // in milliseconds
    errorRate: number; // percentage
}

export interface ApplicationMetrics {
    cpu: {
        current: number;
        limit: number;
        unit: string;
    };
    memory: {
        current: number;
        limit: number;
        unit: string;
    };
    network: {
        bytesIn: number;
        bytesOut: number;
    };
    requests: {
        total: number;
        perSecond: number;
        errors: number;
    };
}

export interface ApplicationResources {
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
}

export interface ApplicationLog {
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'debug';
    message: string;
    source: string;
    metadata?: Record<string, any>;
}

export interface Vulnerability {
    id: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    title: string;
    description: string;
    cve?: string;
    cvss?: number;
    package?: string;
    version?: string;
    fixedIn?: string;
    discovered: string;
    status: 'open' | 'fixed' | 'ignored';
}

export interface ApplicationFilter {
    status?: ApplicationStatus[];
    environment?: string[];
    team?: string[];
    tags?: string[];
    dateRange?: {
        start: string;
        end: string;
    };
}

export interface ApplicationSort {
    field: keyof Application;
    direction: 'asc' | 'desc';
}

export interface ApplicationAction {
    id: string;
    name: string;
    icon: string;
    action: (application: Application) => void;
    disabled?: boolean;
    confirmation?: string;
}

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