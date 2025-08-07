// File: src/pages/ApplicationDetailsPage.tsx
import { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    Card,
    CardContent,
    Chip,
    Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
    Settings,
    Download,
    RefreshCw,
} from 'lucide-react';
import VulnerabilityScan from '../components/application/VulnerabilityScan';
import ApplicationMetricsDashboard from '../components/ui/ApplicationMetricsDashboard';
import ApplicationLogsViewer from '../components/ui/ApplicationLogsViewer';
import { mockApplications } from '../data/mockApplications';

const ApplicationDetailsPage = () => {
    const { id } = useParams();
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    // Find the application by ID
    const application = mockApplications.find(app => app.id === id);

    if (!application) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Typography variant="h5" color="error">Application not found</Typography>
            </Container>
        );
    }

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, 'default' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning'> = {
            'Running': 'success',
            'Deploying': 'info',
            'Failed': 'error',
            'Stopped': 'default',
            'Pending': 'warning',
            'Archived': 'default'
        };
        return colorMap[status] || 'default';
    };

    const getHealthColor = (status: string) => {
        const colorMap: Record<string, 'default' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning'> = {
            'healthy': 'success',
            'warning': 'warning',
            'critical': 'error'
        };
        return colorMap[status] || 'default';
    };

    const tabContent = [
        // Overview Tab
        <Box sx={{ p: 3 }}>
            <Box display="grid" gridTemplateColumns="2fr 1fr" gap={3}>
                <ApplicationMetricsDashboard application={application} />
                <Box>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Application Info</Typography>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" color="text.secondary">Status:</Typography>
                                <Chip 
                                    label={application.status} 
                                    color={getStatusColor(application.status)} 
                                    size="small" 
                                />
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" color="text.secondary">Health:</Typography>
                                <Chip 
                                    label={application.health.status} 
                                    color={getHealthColor(application.health.status)} 
                                    size="small" 
                                />
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" color="text.secondary">Replicas:</Typography>
                                <Typography variant="body2">{application.replicas}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" color="text.secondary">Environment:</Typography>
                                <Typography variant="body2">{application.environment}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" color="text.secondary">Version:</Typography>
                                <Typography variant="body2">{application.version}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" color="text.secondary">Namespace:</Typography>
                                <Typography variant="body2">{application.namespace}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" color="text.secondary">Team:</Typography>
                                <Typography variant="body2">{application.team}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" color="text.secondary">Owner:</Typography>
                                <Typography variant="body2">{application.owner}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                    
                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Button variant="outlined" size="small" startIcon={<RefreshCw size={16} />}>
                                    Restart
                                </Button>
                                <Button variant="outlined" size="small" startIcon={<Settings size={16} />}>
                                    Scale
                                </Button>
                                <Button variant="outlined" size="small" startIcon={<Download size={16} />}>
                                    Download Logs
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>,
        
        // Deployments Tab (placeholder)
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Deployments</Typography>
            <Typography color="text.secondary">
                Deployment history and configuration will be displayed here.
            </Typography>
        </Box>,
        
        // Resources Tab
        <Box sx={{ p: 3 }}>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Resource Limits</Typography>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">CPU Request:</Typography>
                            <Typography variant="body2">{application.resources.cpu.request}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">CPU Limit:</Typography>
                            <Typography variant="body2">{application.resources.cpu.limit}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">Memory Request:</Typography>
                            <Typography variant="body2">{application.resources.memory.request}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">Memory Limit:</Typography>
                            <Typography variant="body2">{application.resources.memory.limit}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">Storage:</Typography>
                            <Typography variant="body2">{application.resources.storage.size} ({application.resources.storage.type})</Typography>
                        </Box>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Current Usage</Typography>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">CPU:</Typography>
                            <Typography variant="body2">{application.metrics.cpu.current} / {application.metrics.cpu.limit} {application.metrics.cpu.unit}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">Memory:</Typography>
                            <Typography variant="body2">{application.metrics.memory.current} / {application.metrics.memory.limit} {application.metrics.memory.unit}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">Network In:</Typography>
                            <Typography variant="body2">{(application.metrics.network.bytesIn / (1024 * 1024)).toFixed(2)} MB</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">Network Out:</Typography>
                            <Typography variant="body2">{(application.metrics.network.bytesOut / (1024 * 1024)).toFixed(2)} MB</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">Requests/sec:</Typography>
                            <Typography variant="body2">{application.metrics.requests.perSecond}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>,
        
        // Logs Tab
        <Box sx={{ p: 3 }}>
            <ApplicationLogsViewer logs={application.logs} onRefresh={() => console.log('Refreshing logs')} />
        </Box>,
        
        // Vulnerability Scan Tab
        <VulnerabilityScan />
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {application.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {application.description}
                    </Typography>
                </Box>
                <Box display="flex" gap={1}>
                    <Button variant="outlined" startIcon={<Settings size={16} />}>
                        Settings
                    </Button>
                    <Button variant="outlined" startIcon={<Download size={16} />}>
                        Export
                    </Button>
                </Box>
            </Box>

            {/* Tabs */}
            <Paper elevation={1} sx={{ p: 0, borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleChange} aria-label="application details tabs">
                        <Tab label="Overview" />
                        <Tab label="Deployments" />
                        <Tab label="Resources" />
                        <Tab label="Logs" />
                        <Tab label="Vulnerability Scan" />
                    </Tabs>
                </Box>
                {tabContent[tabIndex]}
            </Paper>
        </Container>
    );
};

export default ApplicationDetailsPage;
