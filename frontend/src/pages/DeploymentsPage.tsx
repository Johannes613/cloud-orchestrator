// File: src/pages/DeploymentsPage.tsx
import { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Paper,
    IconButton,
    Button,
    Chip,
    LinearProgress,
    Card,
    CardContent,
    Grid,
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
    Snackbar
} from '@mui/material';
import {
    Download,
    RefreshCw,
    Plus,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Play,
    Pause,
    RotateCcw,
    Eye,
    Settings
} from 'lucide-react';
import { Container, Row, Col } from 'react-bootstrap';
import DeploymentTable from '../components/deployment/DeploymentTable';
import DeploymentMetrics from '../components/deployment/DeploymentMetrics';
import DeploymentTimeline from '../components/deployment/DeploymentTimeline';

interface Application {
    id: string;
    name: string;
    repo_url: string;
    owner: string;
    created_at: string;
}

interface Deployment {
    id: string;
    application_id: string;
    version: string;
    status: 'Pending' | 'Deploying' | 'Success' | 'Failed';
    commit_hash: string;
    environment: 'dev' | 'staging' | 'production';
    deployed_at: string;
    logs_url: string;
    // Additional fields for UI
    application?: Application;
    duration?: number;
}

const DeploymentsPage: React.FC = () => {
    const [deployments, setDeployments] = useState<Deployment[]>([
        {
            id: '1',
            application_id: 'app-1',
            version: 'v1.2.0',
            status: 'Success',
            commit_hash: 'a1b2c3d4',
            environment: 'production',
            deployed_at: '2024-01-15T10:30:00Z',
            logs_url: 'https://logs.example.com/deployment-1',
            duration: 120,
            application: {
                id: 'app-1',
                name: 'Frontend App',
                repo_url: 'https://github.com/company/frontend',
                owner: 'John Doe',
                created_at: '2024-01-01T00:00:00Z'
            }
        },
        {
            id: '2',
            application_id: 'app-2',
            version: 'v1.1.5',
            status: 'Deploying',
            commit_hash: 'e5f6g7h8',
            environment: 'staging',
            deployed_at: '2024-01-15T09:15:00Z',
            logs_url: 'https://logs.example.com/deployment-2',
            duration: 45,
            application: {
                id: 'app-2',
                name: 'Backend API',
                repo_url: 'https://github.com/company/backend',
                owner: 'Jane Smith',
                created_at: '2024-01-01T00:00:00Z'
            }
        },
        {
            id: '3',
            application_id: 'app-1',
            version: 'v1.0.0',
            status: 'Failed',
            commit_hash: 'i9j0k1l2',
            environment: 'production',
            deployed_at: '2024-01-15T08:00:00Z',
            logs_url: 'https://logs.example.com/deployment-3',
            duration: 300,
            application: {
                id: 'app-1',
                name: 'Frontend App',
                repo_url: 'https://github.com/company/frontend',
                owner: 'John Doe',
                created_at: '2024-01-01T00:00:00Z'
            }
        },
        {
            id: '4',
            application_id: 'app-3',
            version: 'v0.9.8',
            status: 'Success',
            commit_hash: 'm3n4o5p6',
            environment: 'dev',
            deployed_at: '2024-01-14T16:45:00Z',
            logs_url: 'https://logs.example.com/deployment-4',
            duration: 95,
            application: {
                id: 'app-3',
                name: 'Mobile App',
                repo_url: 'https://github.com/company/mobile',
                owner: 'Sarah Wilson',
                created_at: '2024-01-01T00:00:00Z'
            }
        }
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [showNewDeploymentDialog, setShowNewDeploymentDialog] = useState(false);
    const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

    const handleRefresh = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setSnackbar({ open: true, message: 'Deployments refreshed successfully!', severity: 'success' });
    };

    const handleNewDeployment = () => {
        setShowNewDeploymentDialog(true);
    };

    const handleRollback = (deployment: Deployment) => {
        setSelectedDeployment(deployment);
        setSnackbar({ open: true, message: `Rollback initiated for ${deployment.version}`, severity: 'warning' });
    };

    const getStatusStats = () => {
        const stats = {
            success: deployments.filter(d => d.status === 'Success').length,
            failed: deployments.filter(d => d.status === 'Failed').length,
            deploying: deployments.filter(d => d.status === 'Deploying').length,
            pending: deployments.filter(d => d.status === 'Pending').length
        };
        return stats;
    };

    const stats = getStatusStats();

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
                                    disabled={isLoading}
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

            {/* Loading Progress */}
            {isLoading && (
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
                    onRollback={handleRollback}
                    onViewDetails={(deployment) => setSelectedDeployment(deployment)}
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
                                <Select label="Application">
                                    <MenuItem value="app-1">Frontend App</MenuItem>
                                    <MenuItem value="app-2">Backend API</MenuItem>
                                    <MenuItem value="app-3">Mobile App</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Version"
                                placeholder="v1.2.1"
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Environment</InputLabel>
                                <Select label="Environment">
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
                        onClick={() => {
                            setShowNewDeploymentDialog(false);
                            setSnackbar({ open: true, message: 'Deployment initiated successfully!', severity: 'success' });
                        }}
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
