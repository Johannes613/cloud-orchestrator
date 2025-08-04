// File: src/pages/ApplicationDetailsPage.tsx
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import { useParams } from 'react-router-dom';
import VulnerabilityScan from '../components/application/VulnerabilityScan';

const ApplicationDetailsPage = () => {
    const { id } = useParams();
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const tabContent = [
        <Box sx={{ p: 3 }}>
            <Typography variant="h6">Overview for {id}</Typography>
        </Box>,
        <Box sx={{ p: 3 }}>
            <Typography variant="h6">Deployments for {id}</Typography>
        </Box>,
        <Box sx={{ p: 3 }}>
            <Typography variant="h6">Resources for {id}</Typography>
        </Box>,
        <VulnerabilityScan />,
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Application Details
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
                View and manage your application's configuration, deployments, and resources.
            </Typography>

            <Paper elevation={1} sx={{ p: 0, borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleChange} aria-label="application details tabs">
                        <Tab label="Overview" />
                        <Tab label="Deployments" />
                        <Tab label="Resources" />
                        <Tab label="Vulnerability Scan" />
                    </Tabs>
                </Box>
                {tabContent[tabIndex]}
            </Paper>
        </Container>
    );
};

export default ApplicationDetailsPage;
