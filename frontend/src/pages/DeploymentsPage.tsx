// File: src/pages/DeploymentsPage.tsx
import { Container, Typography, Box } from '@mui/material';
import DeploymentTable from '../components/deployment/DeploymentTable';

// Mock data for the deployments table
const deployments = [
    { version: 'v1.2.3', status: 'Success', deployedAt: '2024-01-15 10:30 AM' },
    { version: 'v1.2.2', status: 'Success', deployedAt: '2024-01-14 09:45 AM' },
    { version: 'v1.2.1', status: 'Failed', deployedAt: '2024-01-13 02:15 PM' },
    { version: 'v1.2.0', status: 'Success', deployedAt: '2024-01-12 11:00 AM' },
    { version: 'v1.1.9', status: 'Success', deployedAt: '2024-01-11 08:30 AM' },
];

const DeploymentsPage = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Deployments
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage and monitor your application deployments
                </Typography>
            </Box>

            <DeploymentTable data={deployments} />
        </Container>
    );
};

export default DeploymentsPage;
