// File: src/pages/DeploymentsPage.tsx
import { useState } from 'react';
import { Container, Typography, Box, Paper, IconButton } from '@mui/material';
import { Download, RefreshCw } from 'lucide-react';
import DeploymentTable from '../components/deployment/DeploymentTable';

const DeploymentsPage: React.FC = () => {
    const [deployments] = useState([
        {
            version: 'v1.2.0',
            status: 'Success' as const,
            deployedAt: '2024-01-15T10:30:00Z'
        },
        {
            version: 'v1.1.5',
            status: 'Pending' as const,
            deployedAt: '2024-01-15T09:15:00Z'
        },
        {
            version: 'v1.0.0',
            status: 'Failed' as const,
            deployedAt: '2024-01-15T08:00:00Z'
        }
    ]);

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Deployments
                </Typography>
                <Box display="flex" gap={1}>
                    <IconButton size="small">
                        <RefreshCw size={16} />
                    </IconButton>
                    <IconButton size="small">
                        <Download size={16} />
                    </IconButton>
                </Box>
            </Box>

            <Paper sx={{ p: 2 }}>
                <DeploymentTable data={deployments} />
            </Paper>
        </Container>
    );
};

export default DeploymentsPage;
