import React from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import SeverityBadge from '../application/SeverityPage';

interface AppCardProps {
    id: string;
    name: string;
    status: 'Running' | 'Deploying' | 'Failed' | 'Archived';
    replicas: number;
    created: string;
}

/**
 * A simple card component to display application status in a list format.
 * @param {AppCardProps} props - The component props.
 */
const AppCard: React.FC<AppCardProps> = ({ id, name, status, replicas, created }) => {
    // Map status to severity for the badge color
    const getStatusSeverity = (s: string) => {
        if (s === 'Running') return 'Low';
        if (s === 'Deploying') return 'Medium';
        return 'High'; // For 'Failed'
    };

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                mb: 2,
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                gap: 2,
                alignItems: 'center',
                borderRadius: 2,
            }}
        >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{name}</Typography>
            <SeverityBadge severity={getStatusSeverity(status) as any} />
            <Typography variant="body1">{replicas}</Typography>
            <Typography variant="body1">{created}</Typography>
            <Box textAlign="right">
                <Button component={Link} to={`/applications/${id}`} variant="text">View</Button>
            </Box>
        </Paper>
    );
};

export default AppCard;
