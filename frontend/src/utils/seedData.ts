import { firebaseService } from '../services/firebaseService';

export const seedInitialData = async (userId: string) => {
  try {
    // Seed applications
    const applications = [
      {
        name: 'Web Application',
        description: 'Main web application for customer portal',
        namespace: 'default',
        image: 'nginx:latest',
        version: '1.2.0',
        environment: 'production',
        replicas: 3,
        resources: {
          cpu: { request: '100m', limit: '500m' },
          memory: { request: '128Mi', limit: '512Mi' },
          storage: { size: '1Gi', type: 'SSD' }
        },
        tags: ['web', 'frontend', 'production'],
        owner: 'admin@company.com',
        team: 'Frontend'
      },
      {
        name: 'API Gateway',
        description: 'API gateway for microservices',
        namespace: 'api',
        image: 'kong:2.8',
        version: '2.1.0',
        environment: 'production',
        replicas: 2,
        resources: {
          cpu: { request: '200m', limit: '1000m' },
          memory: { request: '256Mi', limit: '1Gi' },
          storage: { size: '2Gi', type: 'SSD' }
        },
        tags: ['api', 'gateway', 'microservices'],
        owner: 'admin@company.com',
        team: 'Backend'
      },
      {
        name: 'Database Service',
        description: 'PostgreSQL database service',
        namespace: 'database',
        image: 'postgres:13',
        version: '1.0.0',
        environment: 'production',
        replicas: 1,
        resources: {
          cpu: { request: '500m', limit: '2000m' },
          memory: { request: '1Gi', limit: '4Gi' },
          storage: { size: '10Gi', type: 'SSD' }
        },
        tags: ['database', 'postgresql', 'persistent'],
        owner: 'admin@company.com',
        team: 'DevOps'
      }
    ];

    // Seed deployments
    const deployments = [
      {
        applicationId: 'web-app-1',
        applicationName: 'Web Application',
        version: '1.2.0',
        environment: 'production',
        status: 'completed' as const,
        replicas: 3,
        namespace: 'default',
        image: 'nginx:latest',
        logs: ['Deployment started', 'Pods created successfully', 'Service exposed'],
        metrics: { cpu: 45, memory: 60, network: 30 }
      },
      {
        applicationId: 'api-gateway-1',
        applicationName: 'API Gateway',
        version: '2.1.0',
        environment: 'production',
        status: 'running' as const,
        replicas: 2,
        namespace: 'api',
        image: 'kong:2.8',
        logs: ['Deployment in progress', 'Scaling up'],
        metrics: { cpu: 75, memory: 80, network: 65 }
      }
    ];

    // Seed clusters
    const clusters = [
      {
        name: 'Production Cluster',
        provider: 'AWS',
        region: 'us-east-1',
        status: 'active' as const,
        nodes: 15,
        cpu: { total: 60, used: 45, available: 15 },
        memory: { total: 120, used: 80, available: 40 },
        storage: { total: 1000, used: 600, available: 400 },
        applications: 8
      },
      {
        name: 'Staging Cluster',
        provider: 'AWS',
        region: 'us-west-2',
        status: 'active' as const,
        nodes: 8,
        cpu: { total: 32, used: 20, available: 12 },
        memory: { total: 64, used: 40, available: 24 },
        storage: { total: 500, used: 300, available: 200 },
        applications: 4
      },
      {
        name: 'Development Cluster',
        provider: 'GCP',
        region: 'us-central1',
        status: 'active' as const,
        nodes: 5,
        cpu: { total: 20, used: 12, available: 8 },
        memory: { total: 40, used: 25, available: 15 },
        storage: { total: 200, used: 120, available: 80 },
        applications: 3
      }
    ];

    console.log('Seeding initial data...');

    // Create applications
    for (const appData of applications) {
      await firebaseService.createApplication(appData, userId);
    }

    // Create deployments
    for (const depData of deployments) {
      await firebaseService.createDeployment(depData, userId);
    }

    // Create clusters
    for (const clusterData of clusters) {
      await firebaseService.createCluster(clusterData, userId);
    }

    // Seed GitOps repositories
    const repositories = [
      {
        name: 'Web App Repository',
        url: 'https://github.com/company/web-app',
        branch: 'main',
        autoDeploy: true,
        environment: 'production',
        namespace: 'production',
        path: '/k8s',
        syncInterval: 300
      },
      {
        name: 'API Service Repository',
        url: 'https://github.com/company/api-service',
        branch: 'main',
        autoDeploy: true,
        environment: 'production',
        namespace: 'production',
        path: '/deploy',
        syncInterval: 600
      },
      {
        name: 'Infrastructure Repository',
        url: 'https://github.com/company/infrastructure',
        branch: 'main',
        autoDeploy: false,
        environment: 'production',
        namespace: 'infrastructure',
        path: '/',
        syncInterval: 1800
      }
    ];

    for (const repoData of repositories) {
      await firebaseService.createRepository(repoData, userId);
    }

    // Seed deployment history
    const deploymentHistory = [
      {
        repositoryId: 'repo-1',
        repositoryName: 'Web App Repository',
        commitHash: 'abc123def456',
        commitMessage: 'Update web app configuration',
        branch: 'main',
        author: 'john.doe@company.com',
        status: 'success',
        duration: 120,
        environment: 'production',
        namespace: 'production',
        resources: {
          deployments: 3,
          services: 2,
          configMaps: 1,
          secrets: 0
        },
        logs: ['Deployment started', 'Pods created successfully', 'Service exposed']
      },
      {
        repositoryId: 'repo-2',
        repositoryName: 'API Service Repository',
        commitHash: 'def456ghi789',
        commitMessage: 'Add new API endpoint',
        branch: 'main',
        author: 'jane.smith@company.com',
        status: 'success',
        duration: 180,
        environment: 'production',
        namespace: 'production',
        resources: {
          deployments: 5,
          services: 3,
          configMaps: 2,
          secrets: 1
        },
        logs: ['Deployment started', 'Scaling to 5 replicas', 'Health checks passed']
      }
    ];

    for (const historyData of deploymentHistory) {
      await firebaseService.createDeploymentHistory(historyData, userId);
    }

    console.log('Initial data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}; 