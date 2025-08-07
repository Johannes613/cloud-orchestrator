import { useState, useMemo, useEffect } from 'react';
import {
    Container, Typography, Box, Paper, InputBase, Button, ButtonGroup,
    Grid, Dialog, DialogTitle, DialogContent, DialogActions,
    Alert, CircularProgress
} from '@mui/material';
import {
    Search as SearchIcon, PlusCircle, Grid3X3, List,
    Download, Upload
} from 'lucide-react';

import EnhancedAppCard from '../components/ui/EnhancedAppCard';
import ApplicationFilters from '../components/ui/ApplicationFilters';
import ApplicationMetricsDashboard from '../components/ui/ApplicationMetricsDashboard';
import ApplicationLogsViewer from '../components/ui/ApplicationLogsViewer';
import StatusCard from '../components/ui/StatusCard';
import CreateApplicationForm from '../components/ui/CreateApplicationForm';

import type { Application, ApplicationFilter } from '../types/application';
import { firebaseService } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { mockApplications } from '../utils/mockData';
import { showSignInPrompt } from '../utils/toast';

const ApplicationsPage = () => {
    const { currentUser } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<ApplicationFilter>({});
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showMetricsDialog, setShowMetricsDialog] = useState(false);
    const [showLogsDialog, setShowLogsDialog] = useState(false);

    // Load applications from Firebase
    const loadApplications = async () => {
        if (!currentUser) {
            // Show mock data for non-logged-in users
            setApplications(mockApplications);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const data = await firebaseService.getApplications(currentUser.uid);
            setApplications(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, [currentUser]);

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.team.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = !filters.status || filters.status.length === 0 || filters.status.includes(app.status);
            const matchesEnvironment = !filters.environment || filters.environment.length === 0 || filters.environment.includes(app.environment);
            const matchesTeam = !filters.team || filters.team.length === 0 || filters.team.includes(app.team);
            const matchesTags = !filters.tags || filters.tags.length === 0 ||
                filters.tags.some(tag => app.tags.includes(tag));

            return matchesSearch && matchesStatus && matchesEnvironment && matchesTeam && matchesTags;
        });
    }, [applications, searchTerm, filters]);

    const handleApplicationAction = (action: string, application: Application) => {
        if (!currentUser) {
            showSignInPrompt();
            return;
        }
        
        switch (action) {
            case 'metrics':
                setSelectedApplication(application);
                setShowMetricsDialog(true);
                break;
            case 'logs':
                setSelectedApplication(application);
                setShowLogsDialog(true);
                break;
            case 'view':
            case 'edit':
            case 'delete':
                // You can extend these as needed
                break;
        }
    };

    const handleClearFilters = () => setFilters({});

    const handleCreateSuccess = () => {
        // Reload applications after creating a new one
        loadApplications();
    };

    const getStatusCounts = () => {
        const counts = {
            Running: 0, Deploying: 0, Failed: 0,
            Pending: 0, Stopped: 0, Archived: 0
        };
        applications.forEach(app => {
            counts[app.status] = (counts[app.status] || 0) + 1;
        });
        return counts;
    };

    const statusCounts = getStatusCounts();

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 1 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 1 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">Applications</Typography>
                <Button
                    variant="contained"
                    startIcon={<PlusCircle />}
                    onClick={() => {
                        if (!currentUser) {
                            showSignInPrompt();
                            return;
                        }
                        setShowCreateDialog(true);
                    }}
                >
                    New Application
                </Button>
            </Box>

            {/* Demo Notification for Non-logged-in Users */}
            {!currentUser && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You're viewing demonstration data. Sign in to access your personal applications and manage them.
                </Alert>
            )}

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Status Overview */}
            <Grid container spacing={3} mb={5}>
                {Object.entries(statusCounts).map(([status, count]) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={status}>
                        <StatusCard status={status} count={count} />
                    </Grid>
                ))}
            </Grid>

            {/* Filters */}
            <ApplicationFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
            />

            {/* Search & Controls */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
                    <SearchIcon size={20} style={{ marginLeft: 8, marginRight: 8 }} />
                    <InputBase
                        placeholder="Search applications..."
                        sx={{ flex: 1 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Paper>
                <Box display="flex" gap={1}>
                    <ButtonGroup size="small">
                        <Button
                            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                            onClick={() => setViewMode('grid')}
                            startIcon={<Grid3X3 size={16} />}
                        >
                            Grid
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'contained' : 'outlined'}
                            onClick={() => setViewMode('list')}
                            startIcon={<List size={16} />}
                        >
                            List
                        </Button>
                    </ButtonGroup>
                    <Button variant="outlined" startIcon={<Download size={16} />}>Export</Button>
                    <Button variant="outlined" startIcon={<Upload size={16} />}>Import</Button>
                </Box>
            </Box>

            {/* Application List */}
            {filteredApplications.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography>No applications found</Typography>
                </Paper>
            ) : viewMode === 'grid' ? (
                <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                    {filteredApplications.map(app => (
                        <div style={{ gridColumn: 'span 3' }} key={app.id}>
                            <EnhancedAppCard application={app} onAction={handleApplicationAction} />
                        </div>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                    {filteredApplications.map(app => (
                        <div style={{ gridColumn: 'span 4' }} key={app.id}>
                            <EnhancedAppCard key={app.id} application={app} onAction={handleApplicationAction} />
                        </div>
                    ))}
                </Box>
            )}

            {/* Create Application Form */}
            <CreateApplicationForm
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onSuccess={handleCreateSuccess}
            />

            {/* Metrics Dialog */}
            <Dialog open={showMetricsDialog} onClose={() => setShowMetricsDialog(false)} maxWidth="lg" fullWidth>
                <DialogTitle>{selectedApplication?.name} - Metrics Dashboard</DialogTitle>
                <DialogContent>
                    {selectedApplication && (
                        <ApplicationMetricsDashboard application={selectedApplication} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowMetricsDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Logs Dialog */}
            <Dialog open={showLogsDialog} onClose={() => setShowLogsDialog(false)} maxWidth="lg" fullWidth>
                <DialogTitle>{selectedApplication?.name} - Application Logs</DialogTitle>
                <DialogContent>
                    {selectedApplication && (
                        <ApplicationLogsViewer
                            logs={selectedApplication.logs}
                            onRefresh={() => console.log('Refreshing logs')}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowLogsDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ApplicationsPage;
