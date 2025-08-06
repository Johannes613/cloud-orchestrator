// File: src/pages/GitOpsPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
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
    useTheme,
    CircularProgress
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

// Import API service
import { gitopsApiService } from '../services/gitopsApi';
import type { Repository, DeploymentHistory as DeploymentHistoryType } from '../services/gitopsApi';

const GitOpsPage: React.FC = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [deploymentHistory, setDeploymentHistory] = useState<DeploymentHistoryType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
    const [editingRepo, setEditingRepo] = useState<Repository | null>(null);

    // History states
    const [selectedRepoForHistory, setSelectedRepoForHistory] = useState<Repository | null>(null);
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

    // Load data
    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const [reposData, historyData] = await Promise.all([
                gitopsApiService.getRepositories(),
                gitopsApiService.getDeploymentHistory()
            ]);
            
            setRepositories(reposData);
            setDeploymentHistory(historyData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load GitOps data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

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
    const handleAddRepository = async (data: any) => {
        try {
            const newRepo = await gitopsApiService.createRepository(data);
            setRepositories(prev => [newRepo, ...prev]);
            showNotification('Repository added successfully', 'success');
        } catch (err) {
            showNotification('Failed to add repository', 'error');
        }
    };

    const handleEditRepository = async (data: any) => {
        if (editingRepo) {
            try {
                const updatedRepo = await gitopsApiService.updateRepository(editingRepo.id, data);
                setRepositories(prev => prev.map(repo => 
                    repo.id === editingRepo.id ? updatedRepo : repo
                ));
                showNotification('Repository updated successfully', 'success');
            } catch (err) {
                showNotification('Failed to update repository', 'error');
            }
        }
    };

    const handleDeleteRepository = async (repoId: string) => {
        try {
            await gitopsApiService.deleteRepository(repoId);
            setRepositories(prev => prev.filter(repo => repo.id !== repoId));
            showNotification('Repository deleted successfully', 'success');
        } catch (err) {
            showNotification('Failed to delete repository', 'error');
        }
    };

    const handleToggleAutoDeploy = async (repoId: string, enabled: boolean) => {
        try {
            const updatedRepo = await gitopsApiService.updateRepository(repoId, { autoDeploy: enabled });
            setRepositories(prev => prev.map(repo => 
                repo.id === repoId ? updatedRepo : repo
            ));
            showNotification(`Auto-deploy ${enabled ? 'enabled' : 'disabled'}`, 'info');
        } catch (err) {
            showNotification('Failed to update auto-deploy setting', 'error');
        }
    };

    const handleSync = async (repoId: string) => {
        try {
            setRepositories(prev => prev.map(repo => 
                repo.id === repoId ? { ...repo, status: 'Syncing' } : repo
            ));
            
            const result = await gitopsApiService.syncRepository(repoId);
            setRepositories(prev => prev.map(repo => 
                repo.id === repoId ? result.repository : repo
            ));
            showNotification('Repository synced successfully', 'success');
        } catch (err) {
            setRepositories(prev => prev.map(repo => 
                repo.id === repoId ? { ...repo, status: 'Error' } : repo
            ));
            showNotification('Failed to sync repository', 'error');
        }
    };

    const handleViewHistory = (repo: Repository) => {
        setSelectedRepoForHistory(repo);
        setHistoryOpen(true);
    };

    const handleEdit = (repo: Repository) => {
        setEditingRepo(repo);
        setFormMode('edit');
        setFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingRepo(null);
        setFormMode('add');
        setFormOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        if (formMode === 'add') {
            await handleAddRepository(data);
        } else {
            await handleEditRepository(data);
        }
        setFormOpen(false);
        setEditingRepo(null);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await loadData();
            showNotification('GitOps data refreshed successfully!', 'success');
        } catch (err) {
            showNotification('Failed to refresh GitOps data', 'error');
        } finally {
            setIsRefreshing(false);
        }
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

    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

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
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        Refresh
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

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

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
                        deployments={deploymentHistory}
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
                            deployments={deploymentHistory.filter(d => d.repositoryId === selectedRepoForHistory.id)}
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
