// File: src/pages/GitOpsPage.tsx
import { useState } from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { Plus, RefreshCw } from 'lucide-react';
import RepositoryTable from '../components/gitops/RepositoryTable';

const GitOpsPage: React.FC = () => {
    const [repositories] = useState([
        {
            name: 'webapp-repo',
            branch: 'main',
            autoDeploy: true,
            status: 'Active' as const,
            lastDeployed: '2024-01-15T10:30:00Z'
        },
        {
            name: 'api-repo',
            branch: 'develop',
            autoDeploy: true,
            status: 'Active' as const,
            lastDeployed: '2024-01-15T09:15:00Z'
        },
        {
            name: 'config-repo',
            branch: 'main',
            autoDeploy: false,
            status: 'Inactive' as const,
            lastDeployed: '2024-01-14T16:45:00Z'
        }
    ]);

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    GitOps
                </Typography>
                <Box display="flex" gap={1}>
                    <Button variant="outlined" startIcon={<RefreshCw size={16} />}>
                        Sync All
                    </Button>
                    <Button variant="contained" startIcon={<Plus size={16} />}>
                        Add Repository
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ p: 2 }}>
                <RepositoryTable data={repositories} />
            </Paper>
        </Container>
    );
};

export default GitOpsPage;
