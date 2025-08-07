// File: src/pages/DeploymentsPage.tsx
import { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Paper,
    IconButton,
    Button,
    LinearProgress,
    Card,
    CardContent,
    Fab,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import {
    Download,
    RefreshCw,
    Plus,
    Clock,
    CheckCircle,
    XCircle,

    Play
} from 'lucide-react';
import { Container, Row, Col } from 'react-bootstrap';
import DeploymentTable from '../components/deployment/DeploymentTable';
import DeploymentMetrics from '../components/deployment/DeploymentMetrics';
import DeploymentTimeline from '../components/deployment/DeploymentTimeline';
import { firebaseService } from '../services/firebaseService';
import type { Deployment } from '../services/firebaseService';
import type { Application } from '../types/application';
import { useAuth } from '../contexts/AuthContext';
import { mockDeployments, mockApplications } from '../utils/mockData';
import { showSignInPrompt } from '../utils/toast';

const DeploymentsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showNewDeploymentDialog, setShowNewDeploymentDialog] = useState(false);
    // const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

    // Form state for new deployment
    const [deploymentForm, setDeploymentForm] = useState({
        application_id: '',
        version: '',
        environment: '',
        commit_hash: '',
        description: ''
    });

    // Load deployments and applications
    const loadData = async () => {
        if (!currentUser) {
            // Show mock data for non-logged-in users
            setDeployments(mockDeployments);
            setApplications(mockApplications);
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            
            // Load both deployments and applications
            const [deploymentsData, applicationsData] = await Promise.all([
                firebaseService.getDeployments(currentUser.uid),
                firebaseService.getApplications(currentUser.uid)
            ]);
            
            setDeployments(deploymentsData);
            setApplications(applicationsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load deployments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [currentUser]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await loadData();
            setSnackbar({ open: true, message: 'Deployments refreshed successfully!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to refresh deployments', severity: 'error' });
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleNewDeployment = () => {
        if (!currentUser) {
            showSignInPrompt();
            return;
        }
        setShowNewDeploymentDialog(true);
        // Reset form when opening dialog
        setDeploymentForm({
            application_id: '',
            version: '',
            environment: '',
            commit_hash: '',
            description: ''
        });
    };

    const handleCreateDeployment = async (deploymentData: any) => {
        try {
            const newDeployment = await firebaseService.createDeployment(deploymentData, currentUser!.uid);
            setDeployments(prev => [newDeployment, ...prev]);
            setShowNewDeploymentDialog(false);
            setSnackbar({ open: true, message: 'Deployment initiated successfully!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to create deployment', severity: 'error' });
        }
    };

    const handleRollback = async (deployment: Deployment) => {
        if (!currentUser) {
            showSignInPrompt();
            return;
        }
        try {
            // Update deployment status to rolled_back
            await firebaseService.updateDeployment(deployment.id, { status: 'rolled_back' });
            setSnackbar({ open: true, message: `Rollback initiated for ${deployment.version}`, severity: 'warning' });
            // Refresh deployments to show the updated status
            await loadData();
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to initiate rollback', severity: 'error' });
        }
    };

    const handleFormChange = (field: string, value: string) => {
        setDeploymentForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitDeployment = () => {
        if (!deploymentForm.application_id || !deploymentForm.version || !deploymentForm.environment || !deploymentForm.commit_hash) {
            setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
            return;
        }

        handleCreateDeployment({
            application_id: deploymentForm.application_id,
            version: deploymentForm.version,
            environment: deploymentForm.environment,
            commit_hash: deploymentForm.commit_hash,
            description: deploymentForm.description,
            triggered_by: 'admin@company.com'
        });
    };

    const getStatusStats = () => {
        const stats = {
            success: deployments.filter(d => d.status === 'completed').length,
            failed: deployments.filter(d => d.status === 'failed').length,
            deploying: deployments.filter(d => d.status === 'running').length,
            pending: deployments.filter(d => d.status === 'pending').length
        };
        return stats;
    };

    const stats = getStatusStats();

    if (isLoading) {
        return (
            <Container fluid className="p-2">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container fluid className="p-2">
            {/* Header Section */}
            <Row className="mb-4">
                <Col>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Box>
                            <Typography variant="h4" component="h2" gutterBottom sx={{
                                fontWeight: 700,
                                color: 'black',
                                mb: 1
                            }}>
                                Deployments
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Manage and monitor your application deployments across environments
                            </Typography>
                        </Box>
                        <Box display="flex" gap={2}>
                            <Tooltip title="Refresh Deployments">
                                <IconButton
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    sx={{
                                        bgcolor: 'black',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'black' }
                                    }}
                                >
                                    <RefreshCw size={20} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export Deployments">
                                <IconButton sx={{
                                    bgcolor: 'black',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'black' }
                                }}>
                                    <Download size={20} />
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="contained"
                                startIcon={<Plus />}
                                onClick={handleNewDeployment}
                                sx={{
                                    bgcolor: 'black',
                                    '&:hover': {
                                        bgcolor: 'black',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            >
                                New Deployment
                            </Button>
                        </Box>
                    </Box>
                </Col>
            </Row>

            {/* Demo Notification for Non-logged-in Users */}
            {!currentUser && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You're viewing demonstration data. Sign in to access your personal deployments and manage them.
                </Alert>
            )}

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Loading Progress */}
            {isRefreshing && (
                <Row className="mb-3">
                    <Col>
                        <LinearProgress sx={{ height: 4, borderRadius: 2 }} />
                    </Col>
                </Row>
            )}

            {/* Stats Cards */}
            <Row className="mb-4">
                <Col md={3} className="mb-3">
                    <Card sx={{
                        bgcolor: '#f9f8f8ff',
                        color: 'black',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {stats.success}
                                    </Typography>
                                    <Typography variant="body2">Successful</Typography>
                                </Box>
                                <CheckCircle size={32} />
                            </Box>
                        </CardContent>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card sx={{
                        bgcolor: '#f9f8f8ff',
                        color: 'black',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {stats.failed}
                                    </Typography>
                                    <Typography variant="body2">Failed</Typography>
                                </Box>
                                <XCircle size={32} />
                            </Box>
                        </CardContent>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card sx={{
                        bgcolor: '#f9f8f8ff',
                        color: 'black',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {stats.deploying}
                                    </Typography>
                                    <Typography variant="body2">Deploying</Typography>
                                </Box>
                                <Play size={32} />
                            </Box>
                        </CardContent>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card sx={{
                        bgcolor: '#f9f8f8ff',
                        color: 'black',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {stats.pending}
                                    </Typography>
                                    <Typography variant="body2">Pending</Typography>
                                </Box>
                                <Clock size={32} />
                            </Box>
                        </CardContent>
                    </Card>
                </Col>
            </Row>

            {/* Main Content */}
            <Container fluid>
                {/* Recent Deployments - Full Width */}
                <Row className="mb-4">
                    <Col lg={12}>
                        <Paper
                            elevation={3}
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'black' }}>
                                    Recent Deployments
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Track the latest deployment activities across all environments
                                </Typography>
                            </Box>
                            <DeploymentTable
                                data={deployments}
                                onRollback={(deployment) => handleRollback(deployment)}
                                onViewDetails={(_deployment) => {
                                    // setSelectedDeployment(deployment)
                                }}
                            />
                        </Paper>
                    </Col>
                </Row>

                {/* Metrics and Timeline - Side by Side */}
                <Row>
                    <Col lg={6} className="mb-4">
                        <DeploymentMetrics deployments={deployments} />
                    </Col>
                    <Col lg={6} className="mb-4">
                        <DeploymentTimeline deployments={deployments} />
                    </Col>
                </Row>
            </Container>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleNewDeployment}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    bgcolor: 'black',
                    '&:hover': {
                        bgcolor: 'black',
                        transform: 'scale(1.1)'
                    }
                }}
            >
                <Plus />
            </Fab>

            {/* New Deployment Dialog */}
            <Dialog
                open={showNewDeploymentDialog}
                onClose={() => setShowNewDeploymentDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'black' }}>
                        New Deployment
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Application</InputLabel>
                                <Select 
                                    label="Application" 
                                    value={deploymentForm.application_id}
                                    onChange={(e) => handleFormChange('application_id', e.target.value)}
                                >
                                    {applications.map(app => (
                                        <MenuItem key={app.id} value={app.id}>
                                            {app.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Version"
                                placeholder="v1.2.1"
                                variant="outlined"
                                value={deploymentForm.version}
                                onChange={(e) => handleFormChange('version', e.target.value)}
                            />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Environment</InputLabel>
                                <Select 
                                    label="Environment" 
                                    value={deploymentForm.environment}
                                    onChange={(e) => handleFormChange('environment', e.target.value)}
                                >
                                    <MenuItem value="dev">Development</MenuItem>
                                    <MenuItem value="staging">Staging</MenuItem>
                                    <MenuItem value="production">Production</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Commit Hash"
                                placeholder="a1b2c3d4"
                                variant="outlined"
                                value={deploymentForm.commit_hash}
                                onChange={(e) => handleFormChange('commit_hash', e.target.value)}
                            />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Description"
                                placeholder="Deployment description"
                                variant="outlined"
                                multiline
                                rows={3}
                                value={deploymentForm.description}
                                onChange={(e) => handleFormChange('description', e.target.value)}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowNewDeploymentDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmitDeployment}
                        sx={{ bgcolor: 'black' }}
                    >
                        Deploy
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default DeploymentsPage;
