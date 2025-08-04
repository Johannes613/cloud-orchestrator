// File: src/pages/ClustersPage.tsx
import { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
} from '@mui/material';
import ClusterCard from '../components/cluster/ClusterCard.tsx';

// Mock data for active clusters
const activeClusters = [
    {
        id: 'prod-cluster',
        name: 'Production Cluster',
        status: 'Running',
        nodes: 15,
        pods: 120,
        cpuUsage: '75%',
        memoryUsage: '60%',
        image: 'https://placehold.co/400x200/5e6ad2/white?text=Production+Cluster',
    },
    {
        id: 'staging-cluster',
        name: 'Staging Cluster',
        status: 'Running',
        nodes: 8,
        pods: 60,
        cpuUsage: '50%',
        memoryUsage: '40%',
        image: 'https://placehold.co/400x200/f5a623/white?text=Staging+Cluster',
    },
    {
        id: 'dev-cluster',
        name: 'Development Cluster',
        status: 'Running',
        nodes: 5,
        pods: 30,
        cpuUsage: '30%',
        memoryUsage: '25%',
        image: 'https://placehold.co/400x200/4CAF50/white?text=Development+Cluster',
    },
];

// Mock data for inactive clusters
const inactiveClusters = [
    {
        id: 'archive-cluster',
        name: 'Archived Cluster',
        status: 'Inactive',
        nodes: 0,
        pods: 0,
        cpuUsage: '0%',
        memoryUsage: '0%',
        image: 'https://placehold.co/400x200/9e9e9e/white?text=Archived+Cluster',
    }
];

const ClustersPage = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const clustersToShow = tabValue === 0 ? activeClusters : inactiveClusters;

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Clusters Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Monitor and manage your Kubernetes clusters.
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="cluster tabs" sx={{ px: 2 }}>
                    <Tab label="Active Clusters" />
                    <Tab label="Inactive Clusters" />
                </Tabs>
                <Box mt={3}>
                    {clustersToShow.map((cluster) => (
                        <ClusterCard key={cluster.id} {...cluster} />
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default ClustersPage;
