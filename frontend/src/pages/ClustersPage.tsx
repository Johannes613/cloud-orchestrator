// File: src/pages/ClustersPage.tsx
import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
} from '@mui/material';
import { 
    FilterList as FilterIcon,
    Refresh as RefreshIcon 
} from '@mui/icons-material';
import ClusterCard from '../components/cluster/ClusterCard.tsx';
import { firebaseService } from '../services/firebaseService';
import type { Cluster } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { mockClusters } from '../utils/mockData';



const ClustersPage = () => {
    const { currentUser } = useAuth();
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const loadClusters = async () => {
            if (!currentUser) {
                // Show mock data for non-logged-in users
                setClusters(mockClusters);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const data = await firebaseService.getClusters(currentUser.uid);
                setClusters(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load clusters');
            } finally {
                setLoading(false);
            }
        };

        loadClusters();
    }, [currentUser]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const activeClusters = clusters.filter(cluster => cluster.status === 'active');
    const inactiveClusters = clusters.filter(cluster => cluster.status !== 'active');
    const clustersToShow = tabValue === 0 ? activeClusters : inactiveClusters;

    if (loading) {
        return (
            <Container fluid className="py-4">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                        <Box>
                            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                                Clusters Overview
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                Monitor and manage your Kubernetes clusters across all environments.
                            </Typography>
                        </Box>
                        <Box display="flex" gap={1}>
                            <Tooltip title="Refresh clusters">
                                <IconButton 
                                    sx={{ 
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Filter clusters">
                                <IconButton 
                                    sx={{ 
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                >
                                    <FilterIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Col>
            </Row>

            {/* Demo Notification for Non-logged-in Users */}
            {!currentUser && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You're viewing demonstration data. Sign in to access your personal clusters and manage them.
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Row className="mb-4">
                <Col>
                    <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs 
                                value={tabValue} 
                                onChange={handleTabChange} 
                                aria-label="cluster tabs"
                                sx={{ 
                                    px: 3,
                                    '& .MuiTab-root': {
                                        minHeight: 64,
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                    }
                                }}
                            >
                                <Tab 
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <span>Active Clusters</span>
                                            <Chip 
                                                label={activeClusters.length} 
                                                size="small" 
                                                sx={{ 
                                                    backgroundColor: 'success.main',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem'
                                                }} 
                                            />
                                        </Box>
                                    } 
                                />
                                <Tab 
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <span>Inactive Clusters</span>
                                            <Chip 
                                                label={inactiveClusters.length} 
                                                size="small" 
                                                sx={{ 
                                                    backgroundColor: 'text.disabled',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem'
                                                }} 
                                            />
                                        </Box>
                                    } 
                                />
                            </Tabs>
                        </Box>
                        
                        <Box p={3}>
                            <Row>
                                {clustersToShow.map((cluster) => (
                                    <Col key={cluster.id} lg={6} xl={4} className="mb-4">
                                        <ClusterCard cluster={cluster} />
                                    </Col>
                                ))}
                            </Row>
                            
                            {clustersToShow.length === 0 && (
                                <Box 
                                    display="flex" 
                                    flexDirection="column" 
                                    alignItems="center" 
                                    py={8}
                                    textAlign="center"
                                >
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No {tabValue === 0 ? 'active' : 'inactive'} clusters found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {tabValue === 0 
                                            ? 'Create your first cluster to get started' 
                                            : 'No archived clusters available'
                                        }
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Col>
            </Row>
        </Container>
    );
};

export default ClustersPage;
