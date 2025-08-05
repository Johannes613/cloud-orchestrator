// File: src/pages/GitOpsPage.tsx
import React, { useState, useMemo } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Paper, 
    Button, 
    Tabs, 
    Tab,
    Chip,
    Alert,
    Snackbar,
    Dialog,
    DialogContent,
    useTheme
} from '@mui/material';
import { 
    Plus, 
    RefreshCw, 
    GitBranch, 
    GitCommit, 
    Activity,
    Settings,
    History
} from 'lucide-react';

// Import components
import GitOpsDashboard from '../components/gitops/GitOpsDashboard';
import RepositoryTable from '../components/gitops/RepositoryTable';
import RepositoryForm from '../components/gitops/RepositoryForm';
import DeploymentHistory from '../components/gitops/DeploymentHistory';

interface RepositoryData {
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

interface Deployment {
    id: string;
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

const GitOpsPage: React.FC = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [repositories, setRepositories] = useState<RepositoryData[]>([
        {
            id: '1',
            name: 'webapp-repo',
            url: 'https://github.com/company/webapp',
            branch: 'main',
            autoDeploy: true,
            status: 'Active',
            lastDeployed: '2024-01-15T10:30:00Z',
            environment: 'production',
            namespace: 'webapp',
            path: './k8s',
            syncInterval: 5,
            lastSync: '2024-01-15T10:25:00Z',
            commitCount: 156,
            deploymentCount: 23
        },
        {
            id: '2',
            name: 'api-repo',
            url: 'https://github.com/company/api',
            branch: 'develop',
            autoDeploy: true,
            status: 'Active',
            lastDeployed: '2024-01-15T09:15:00Z',
            environment: 'staging',
            namespace: 'api',
            path: './deploy',
            syncInterval: 5,
            lastSync: '2024-01-15T09:10:00Z',
            commitCount: 89,
            deploymentCount: 15
        },
        {
            id: '3',
            name: 'config-repo',
            url: 'https://github.com/company/config',
            branch: 'main',
            autoDeploy: false,
            status: 'Inactive',
            lastDeployed: '2024-01-14T16:45:00Z',
            environment: 'development',
            namespace: 'config',
            path: './manifests',
            syncInterval: 15,
            lastSync: '2024-01-14T16:40:00Z',
            commitCount: 45,
            deploymentCount: 8
        },
        {
            id: '4',
            name: 'monitoring-repo',
            url: 'https://github.com/company/monitoring',
            branch: 'main',
            autoDeploy: true,
            status: 'Error',
            lastDeployed: '2024-01-15T08:20:00Z',
            environment: 'production',
            namespace: 'monitoring',
            path: './k8s',
            syncInterval: 5,
            lastSync: '2024-01-15T08:15:00Z',
            commitCount: 67,
            deploymentCount: 12
        }
    ]);

    // Form states
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
    const [editingRepo, setEditingRepo] = useState<RepositoryData | null>(null);

    // History states
    const [selectedRepoForHistory, setSelectedRepoForHistory] = useState<RepositoryData | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);

    // Notification states
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Mock deployment history data
    const mockDeployments: Deployment[] = [
        {
            id: '1',
            commitHash: 'a1b2c3d4e5f6',
            commitMessage: 'Add new feature for user authentication',
            branch: 'main',
            author: 'john.doe@company.com',
            timestamp: '2024-01-15T10:30:00Z',
            status: 'success',
            duration: 180,
            environment: 'production',
            namespace: 'webapp',
            resources: {
                deployments: 3,
                services: 2,
                configMaps: 1,
                secrets: 0
            },
            logs: [
                'INFO: Starting deployment for commit a1b2c3d4',
                'INFO: Applying Kubernetes manifests',
                'INFO: Deployment completed successfully',
                'INFO: Health checks passed'
            ]
        },
        {
            id: '2',
            commitHash: 'f6e5d4c3b2a1',
            commitMessage: 'Fix database connection issue',
            branch: 'main',
            author: 'jane.smith@company.com',
            timestamp: '2024-01-15T09:15:00Z',
            status: 'success',
            duration: 120,
            environment: 'production',
            namespace: 'webapp',
            resources: {
                deployments: 3,
                services: 2,
                configMaps: 1,
                secrets: 0
            }
        },
        {
            id: '3',
            commitHash: 'b2c3d4e5f6a1',
            commitMessage: 'Update API endpoints',
            branch: 'develop',
            author: 'mike.wilson@company.com',
            timestamp: '2024-01-15T08:45:00Z',
            status: 'failed',
            duration: 90,
            environment: 'staging',
            namespace: 'api',
            resources: {
                deployments: 2,
                services: 1,
                configMaps: 0,
                secrets: 1
            },
            logs: [
                'ERROR: Failed to apply deployment',
                'ERROR: Image pull failed',
                'ERROR: Deployment rolled back'
            ]
        }
    ];

    // Calculate metrics
    const metrics = useMemo(() => {
        const totalRepositories = repositories.length;
        const activeRepositories = repositories.filter(r => r.status === 'Active').length;
        const totalDeployments = repositories.reduce((sum, r) => sum + r.deploymentCount, 0);
        const successfulDeployments = Math.floor(totalDeployments * 0.85); // Mock data
        const failedDeployments = Math.floor(totalDeployments * 0.10);
        const pendingDeployments = Math.floor(totalDeployments * 0.05);
        const averageDeploymentTime = 8.5; // minutes
        const lastSyncTime = new Date().toISOString();

        return {
            totalRepositories,
            activeRepositories,
            totalDeployments,
            successfulDeployments,
            failedDeployments,
            pendingDeployments,
            averageDeploymentTime,
            lastSyncTime
        };
    }, [repositories]);

    // Handle repository operations
    const handleAddRepository = (data: any) => {
        const newRepo: RepositoryData = {
            id: Date.now().toString(),
            ...data,
            status: 'Active',
            lastDeployed: new Date().toISOString(),
            lastSync: new Date().toISOString(),
            commitCount: 0,
            deploymentCount: 0
        };
        setRepositories(prev => [newRepo, ...prev]);
        showNotification('Repository added successfully', 'success');
    };

    const handleEditRepository = (data: any) => {
        if (editingRepo) {
            setRepositories(prev => prev.map(repo => 
                repo.id === editingRepo.id ? { ...repo, ...data } : repo
            ));
            showNotification('Repository updated successfully', 'success');
        }
    };

    const handleDeleteRepository = (repoId: string) => {
        setRepositories(prev => prev.filter(repo => repo.id !== repoId));
        showNotification('Repository deleted successfully', 'success');
    };

    const handleToggleAutoDeploy = (repoId: string, enabled: boolean) => {
        setRepositories(prev => prev.map(repo => 
            repo.id === repoId ? { ...repo, autoDeploy: enabled } : repo
        ));
        showNotification(`Auto-deploy ${enabled ? 'enabled' : 'disabled'}`, 'info');
    };

    const handleSync = (repoId: string) => {
        setRepositories(prev => prev.map(repo => 
            repo.id === repoId ? { ...repo, status: 'Syncing' } : repo
        ));
        
        // Simulate sync process
        setTimeout(() => {
            setRepositories(prev => prev.map(repo => 
                repo.id === repoId ? { 
                    ...repo, 
                    status: 'Active',
                    lastSync: new Date().toISOString()
                } : repo
            ));
            showNotification('Repository synced successfully', 'success');
        }, 2000);
    };

    const handleViewHistory = (repo: RepositoryData) => {
        setSelectedRepoForHistory(repo);
        setHistoryOpen(true);
    };

    const handleEdit = (repo: RepositoryData) => {
        setEditingRepo(repo);
        setFormMode('edit');
        setFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingRepo(null);
        setFormMode('add');
        setFormOpen(true);
    };

    const handleFormSubmit = (data: any) => {
        if (formMode === 'add') {
            handleAddRepository(data);
        } else {
            handleEditRepository(data);
        }
        setFormOpen(false);
        setEditingRepo(null);
    };

    const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        GitOps Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage Git repositories and automated deployments
                    </Typography>
                </Box>
                
                <Box display="flex" gap={2} alignItems="center">
                    <Chip 
                        icon={<GitBranch size={16} />}
                        label={`${metrics.totalRepositories} repositories`}
                        variant="outlined"
                        sx={{ borderColor: 'black', color: 'black' }}
                    />
                    <Chip 
                        icon={<GitCommit size={16} />}
                        label={`${metrics.totalDeployments} deployments`}
                        variant="outlined"
                        sx={{ borderColor: theme.palette.text.primary, color: theme.palette.text.primary }}
                    />
                    <Button 
                        variant="outlined" 
                        startIcon={<RefreshCw size={16} />}
                        onClick={() => {
                            repositories.forEach(repo => handleSync(repo.id));
                            showNotification('Syncing all repositories...', 'info');
                        }}
                    >
                        Sync All
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<Plus size={16} />}
                        onClick={handleAddNew}
                        sx={{ 
                            backgroundColor: theme.palette.text.primary, 
                            color: theme.palette.background.paper,
                            '&:hover': {
                                backgroundColor: theme.palette.text.secondary
                            }
                        }}
                    >
                        Add Repository
                    </Button>
                </Box>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 3 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                        '& .MuiTab-root': {
                            color: theme.palette.text.secondary,
                            '&.Mui-selected': {
                                color: theme.palette.text.primary,
                                fontWeight: 'bold'
                            }
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: theme.palette.text.primary
                        }
                    }}
                >
                    <Tab 
                        icon={<Activity size={20} />} 
                        label="Dashboard" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<GitBranch size={20} />} 
                        label="Repositories" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<History size={20} />} 
                        label="Deployment History" 
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            {activeTab === 0 && (
                <GitOpsDashboard metrics={metrics} />
            )}

            {activeTab === 1 && (
                <Box>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: 'bold', mb: 3 }}>
                        Git Repositories
                    </Typography>
                    <RepositoryTable 
                        data={repositories}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRepository}
                        onToggleAutoDeploy={handleToggleAutoDeploy}
                        onSync={handleSync}
                        onViewHistory={handleViewHistory}
                    />
                </Box>
            )}

            {activeTab === 2 && (
                <Box>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: 'bold', mb: 3 }}>
                        Deployment History
                    </Typography>
                    <DeploymentHistory 
                        deployments={mockDeployments}
                        repositoryName="All Repositories"
                    />
                </Box>
            )}

            {/* Repository Form Dialog */}
            <RepositoryForm
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditingRepo(null);
                }}
                onSubmit={handleFormSubmit}
                initialData={editingRepo || undefined}
                mode={formMode}
            />

            {/* Deployment History Dialog */}
            {selectedRepoForHistory && (
                <Dialog
                    open={historyOpen}
                    onClose={() => setHistoryOpen(false)}
                    maxWidth="xl"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 3 } }}
                >
                    <DialogContent sx={{ p: 0 }}>
                        <DeploymentHistory 
                            deployments={mockDeployments}
                            repositoryName={selectedRepoForHistory.name}
                        />
                    </DialogContent>
                </Dialog>
            )}

            {/* Notification Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default GitOpsPage;
