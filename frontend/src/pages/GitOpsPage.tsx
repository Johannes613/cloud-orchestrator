// File: src/pages/GitOpsPage.tsx
import {
    Container,
    Typography,
    Box,
} from '@mui/material';
import RepositoryTable from '../components/gitops/RepositoryTable.tsx';

// Mock data for the linked repositories table
const repositories = [
    { name: 'repo-1', branch: 'main', autoDeploy: true, status: 'Active', lastDeployed: '2024-01-15 10:00 AM' },
    { name: 'repo-2', branch: 'develop', autoDeploy: false, status: 'Inactive', lastDeployed: '2023-12-20 02:30 PM' },
    { name: 'repo-3', branch: 'feature/new-feature', autoDeploy: true, status: 'Active', lastDeployed: '2024-02-01 09:15 AM' },
    { name: 'repo-4', branch: 'release/1.0', autoDeploy: false, status: 'Inactive', lastDeployed: '2023-11-10 04:45 PM' },
    { name: 'repo-5', branch: 'hotfix/urgent-fix', autoDeploy: true, status: 'Active', lastDeployed: '2024-02-10 11:30 AM' },
];

const GitOpsPage = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Linked Repositories
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your connected repositories and their deployment settings.
                </Typography>
            </Box>

            <RepositoryTable data={repositories} />
        </Container>
    );
};

export default GitOpsPage;
