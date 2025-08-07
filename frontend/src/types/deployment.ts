import type { Application } from './application';

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