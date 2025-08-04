// File: src/pages/ApplicationsPage.tsx
import {
    Container,
    Typography,
    Box,
    Paper,
    InputBase,
    Button,
    ButtonGroup,
    Tabs,
    Tab,
} from '@mui/material';
import { Search as SearchIcon, PlusCircle } from 'lucide-react';
import AppCard from '../components/ui/AppCard.tsx';

// Mock data for the applications list
const applications = [
    { id: '1', name: 'WebApp-1', status: 'Running', replicas: 3, created: '2023-08-15' },
    { id: '2', name: 'Microservice-A', status: 'Deploying', replicas: 1, created: '2023-08-14' },
    { id: '3', name: 'DataProcessor', status: 'Failed', replicas: 2, created: '2023-08-12' },
    { id: '4', name: 'AuthService', status: 'Running', replicas: 2, created: '2023-08-10' },
    { id: '5', name: 'API-Gateway', status: 'Running', replicas: 1, created: '2023-08-08' },
];

const ApplicationsPage = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Applications
                </Typography>
                <Button variant="contained" startIcon={<PlusCircle />}>
                    New Application
                </Button>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Tabs value={0} aria-label="application tabs">
                    <Tab label="All Applications" />
                    <Tab label="Archived" />
                </Tabs>
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, borderRadius: 2 }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search applications..."
                    />
                    <SearchIcon size={20} style={{ margin: '0 8px' }} />
                </Paper>
            </Box>

            <Box>
                {applications.map((app) => (
                    <AppCard key={app.id} {...app} />
                ))}
            </Box>
        </Container>
    );
};

export default ApplicationsPage;
