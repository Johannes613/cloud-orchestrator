export interface Application {
  id: string;
  name: string;
  description: string;
  status: string;
  replicas: number;
  created: string;
  updated: string;
  namespace: string;
  image: string;
  version: string;
  environment: string;
  health: {
    status: string;
    lastCheck: string;
    responseTime: number;
    uptime: number;
    errorRate: number;
  };
  metrics: {
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
  };
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
  logs: any[];
  vulnerabilities: any[];
  tags: string[];
  owner: string;
  team: string;
}

export interface Deployment {
  id: string;
  application_id: string;
  version: string;
  status: 'Pending' | 'Deploying' | 'Success' | 'Failed';
  commit_hash: string;
  environment: 'dev' | 'staging' | 'production';
  deployed_at: string;
  logs_url: string;
  duration: number;
  created: string;
  updated: string;
  description: string;
  triggered_by: string;
  rollback_version: string;
  deployment_strategy: string;
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
  };
  // Additional fields for UI
  application?: Application;
} 