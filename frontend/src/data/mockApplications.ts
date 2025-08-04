import type { Application } from '../types/application';

export const mockApplications: Application[] = [
    {
        id: '1',
        name: 'WebApp-1',
        description: 'Main web application for customer portal',
        status: 'Running',
        replicas: 3,
        created: '2023-08-15',
        updated: '2024-01-15',
        namespace: 'default',
        image: 'nginx:1.24',
        version: '2.1.0',
        environment: 'production',
        health: {
            status: 'healthy',
            lastCheck: '2024-01-15T10:30:00Z',
            responseTime: 120,
            uptime: 86400,
            errorRate: 0.5
        },
        metrics: {
            cpu: {
                current: 1.2,
                limit: 2.0,
                unit: 'cores'
            },
            memory: {
                current: 512,
                limit: 1024,
                unit: 'Mi'
            },
            network: {
                bytesIn: 1024 * 1024 * 1024,
                bytesOut: 512 * 1024 * 1024
            },
            requests: {
                total: 1500000,
                perSecond: 25.5,
                errors: 7500
            }
        },
        resources: {
            cpu: {
                request: '500m',
                limit: '2'
            },
            memory: {
                request: '256Mi',
                limit: '1Gi'
            },
            storage: {
                size: '10Gi',
                type: 'SSD'
            }
        },
        logs: [
            {
                id: '1',
                timestamp: '2024-01-15T10:30:00Z',
                level: 'info',
                source: 'app',
                message: 'Application started successfully'
            },
            {
                id: '2',
                timestamp: '2024-01-15T10:29:00Z',
                level: 'info',
                source: 'nginx',
                message: 'Server listening on port 80'
            },
            {
                id: '3',
                timestamp: '2024-01-15T10:28:00Z',
                level: 'warning',
                source: 'app',
                message: 'High memory usage detected'
            }
        ],
        vulnerabilities: [
            {
                id: '1',
                severity: 'Medium',
                title: 'SQL injection vulnerability',
                description: 'SQL injection vulnerability in database queries',
                cve: 'CVE-2023-1234',
                cvss: 6.5,
                package: 'database',
                version: '1.0.0',
                fixedIn: '1.0.1',
                discovered: '2024-01-10',
                status: 'open'
            }
        ],
        tags: ['web', 'frontend', 'customer-portal'],
        owner: 'john.doe@company.com',
        team: 'Frontend'
    },
    {
        id: '2',
        name: 'Microservice-A',
        description: 'Authentication and authorization service',
        status: 'Deploying',
        replicas: 1,
        created: '2023-08-14',
        updated: '2024-01-15',
        namespace: 'auth',
        image: 'auth-service:1.2.0',
        version: '1.2.0',
        environment: 'staging',
        health: {
            status: 'warning',
            lastCheck: '2024-01-15T10:25:00Z',
            responseTime: 250,
            uptime: 43200,
            errorRate: 2.0
        },
        metrics: {
            cpu: {
                current: 0.8,
                limit: 1.0,
                unit: 'cores'
            },
            memory: {
                current: 768,
                limit: 1024,
                unit: 'Mi'
            },
            network: {
                bytesIn: 512 * 1024 * 1024,
                bytesOut: 256 * 1024 * 1024
            },
            requests: {
                total: 800000,
                perSecond: 15.2,
                errors: 16000
            }
        },
        resources: {
            cpu: {
                request: '200m',
                limit: '1'
            },
            memory: {
                request: '512Mi',
                limit: '1Gi'
            },
            storage: {
                size: '5Gi',
                type: 'SSD'
            }
        },
        logs: [
            {
                id: '1',
                timestamp: '2024-01-15T10:25:00Z',
                level: 'warning',
                source: 'auth',
                message: 'High CPU usage detected'
            },
            {
                id: '2',
                timestamp: '2024-01-15T10:24:00Z',
                level: 'info',
                source: 'auth',
                message: 'Service deployment in progress'
            }
        ],
        vulnerabilities: [
            {
                id: '2',
                severity: 'High',
                title: 'Authentication bypass vulnerability',
                description: 'Authentication bypass vulnerability in auth service',
                cve: 'CVE-2023-5678',
                cvss: 8.5,
                package: 'auth-service',
                version: '1.2.0',
                fixedIn: '1.2.1',
                discovered: '2024-01-12',
                status: 'open'
            }
        ],
        tags: ['microservice', 'auth', 'security'],
        owner: 'jane.smith@company.com',
        team: 'Backend'
    },
    {
        id: '3',
        name: 'DataProcessor',
        description: 'Data processing and analytics service',
        status: 'Failed',
        replicas: 2,
        created: '2023-08-12',
        updated: '2024-01-15',
        namespace: 'data',
        image: 'data-processor:2.0.1',
        version: '2.0.1',
        environment: 'production',
        health: {
            status: 'critical',
            lastCheck: '2024-01-15T10:20:00Z',
            responseTime: 5000,
            uptime: 0,
            errorRate: 100
        },
        metrics: {
            cpu: {
                current: 0,
                limit: 4.0,
                unit: 'cores'
            },
            memory: {
                current: 0,
                limit: 2048,
                unit: 'Mi'
            },
            network: {
                bytesIn: 0,
                bytesOut: 0
            },
            requests: {
                total: 0,
                perSecond: 0,
                errors: 0
            }
        },
        resources: {
            cpu: {
                request: '1',
                limit: '4'
            },
            memory: {
                request: '1Gi',
                limit: '2Gi'
            },
            storage: {
                size: '20Gi',
                type: 'SSD'
            }
        },
        logs: [
            {
                id: '1',
                timestamp: '2024-01-15T10:20:00Z',
                level: 'error',
                source: 'data-processor',
                message: 'Service crashed due to memory overflow'
            },
            {
                id: '2',
                timestamp: '2024-01-15T10:19:00Z',
                level: 'error',
                source: 'data-processor',
                message: 'Failed to connect to database'
            }
        ],
        vulnerabilities: [
            {
                id: '3',
                severity: 'Critical',
                title: 'Remote code execution vulnerability',
                description: 'Remote code execution vulnerability in data processor',
                cve: 'CVE-2023-9012',
                cvss: 9.8,
                package: 'data-processor',
                version: '2.0.1',
                fixedIn: '2.0.2',
                discovered: '2024-01-15',
                status: 'open'
            }
        ],
        tags: ['data', 'analytics', 'processing'],
        owner: 'bob.wilson@company.com',
        team: 'Data'
    },
    {
        id: '4',
        name: 'AuthService',
        description: 'User authentication service',
        status: 'Running',
        replicas: 2,
        created: '2023-08-10',
        updated: '2024-01-15',
        namespace: 'auth',
        image: 'auth-service:1.1.5',
        version: '1.1.5',
        environment: 'production',
        health: {
            status: 'healthy',
            lastCheck: '2024-01-15T10:30:00Z',
            responseTime: 80,
            uptime: 172800,
            errorRate: 0.2
        },
        metrics: {
            cpu: {
                current: 0.6,
                limit: 1.0,
                unit: 'cores'
            },
            memory: {
                current: 512,
                limit: 1024,
                unit: 'Mi'
            },
            network: {
                bytesIn: 256 * 1024 * 1024,
                bytesOut: 128 * 1024 * 1024
            },
            requests: {
                total: 1200000,
                perSecond: 20.8,
                errors: 2400
            }
        },
        resources: {
            cpu: {
                request: '300m',
                limit: '1'
            },
            memory: {
                request: '256Mi',
                limit: '1Gi'
            },
            storage: {
                size: '2Gi',
                type: 'SSD'
            }
        },
        logs: [
            {
                id: '1',
                timestamp: '2024-01-15T10:30:00Z',
                level: 'info',
                source: 'auth',
                message: 'Authentication successful'
            },
            {
                id: '2',
                timestamp: '2024-01-15T10:29:00Z',
                level: 'info',
                source: 'auth',
                message: 'User session created'
            }
        ],
        vulnerabilities: [],
        tags: ['auth', 'security', 'user-management'],
        owner: 'alice.johnson@company.com',
        team: 'Security'
    },
    {
        id: '5',
        name: 'API-Gateway',
        description: 'API gateway and load balancer',
        status: 'Running',
        replicas: 1,
        created: '2023-08-08',
        updated: '2024-01-15',
        namespace: 'gateway',
        image: 'api-gateway:1.0.3',
        version: '1.0.3',
        environment: 'production',
        health: {
            status: 'healthy',
            lastCheck: '2024-01-15T10:30:00Z',
            responseTime: 50,
            uptime: 259200,
            errorRate: 0.1
        },
        metrics: {
            cpu: {
                current: 0.4,
                limit: 1.0,
                unit: 'cores'
            },
            memory: {
                current: 256,
                limit: 512,
                unit: 'Mi'
            },
            network: {
                bytesIn: 2048 * 1024 * 1024,
                bytesOut: 1024 * 1024 * 1024
            },
            requests: {
                total: 5000000,
                perSecond: 85.2,
                errors: 5000
            }
        },
        resources: {
            cpu: {
                request: '200m',
                limit: '1'
            },
            memory: {
                request: '128Mi',
                limit: '512Mi'
            },
            storage: {
                size: '1Gi',
                type: 'SSD'
            }
        },
        logs: [
            {
                id: '1',
                timestamp: '2024-01-15T10:30:00Z',
                level: 'info',
                source: 'gateway',
                message: 'Request routed successfully'
            },
            {
                id: '2',
                timestamp: '2024-01-15T10:29:00Z',
                level: 'info',
                source: 'gateway',
                message: 'Load balancer health check passed'
            }
        ],
        vulnerabilities: [
            {
                id: '4',
                severity: 'Low',
                title: 'Information disclosure vulnerability',
                description: 'Information disclosure vulnerability in API gateway',
                cve: 'CVE-2023-3456',
                cvss: 3.5,
                package: 'api-gateway',
                version: '1.0.3',
                fixedIn: '1.0.4',
                discovered: '2024-01-08',
                status: 'open'
            }
        ],
        tags: ['gateway', 'api', 'load-balancer'],
        owner: 'david.brown@company.com',
        team: 'DevOps'
    }
]; 