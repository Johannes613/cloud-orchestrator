import React from 'react';
import { Card, Box, Typography, alpha } from '@mui/material';
import { PlayCircle, AlertCircle, RefreshCw, StopCircle, Package } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

interface StatusCardProps {
    status: string;
    count: number;
}

// Define the icon and color mapping for each status
const statusConfig: Record<string, { icon: LucideIcon; color: string; gradient: string }> = {
    'Running': {
        icon: PlayCircle,
        color: '#4caf50', // green
        gradient: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
    },
    'Deploying': {
        icon: RefreshCw,
        color: '#2196f3', // blue
        gradient: 'linear-gradient(45deg, #2196f3 30%, #42a5f5 90%)',
    },
    'Failed': {
        icon: AlertCircle,
        color: '#f44336', // red
        gradient: 'linear-gradient(45deg, #f44336 30%, #ef5350 90%)',
    },
    'Stopped': {
        icon: StopCircle,
        color: '#9e9e9e', // grey
        gradient: 'linear-gradient(45deg, #9e9e9e 30%, #bdbdbd 90%)',
    },
    'Archived': {
        icon: Package,
        color: '#607d8b', // blue-grey
        gradient: 'linear-gradient(45deg, #607d8b 30%, #78909c 90%)',
    },
    'Pending': {
        icon: StopCircle, // Using StopCircle for pending as well
        color: '#ff9800', // orange
        gradient: 'linear-gradient(45deg, #ff9800 30%, #ffa726 90%)',
    },
};

/**
 * A visually enhanced card for displaying application status and count.
 * @param {StatusCardProps} props - The component props.
 * @param {string} props.status - The name of the status (e.g., 'Running').
 * @param {number} props.count - The number of applications with that status.
 */
const StatusCard: React.FC<StatusCardProps> = ({ status, count }) => {
    const config = statusConfig[status] || { icon: StopCircle, color: '#9e9e9e', gradient: 'linear-gradient(45deg, #9e9e9e 30%, #bdbdbd 90%)' };
    const Icon = config.icon;

    return (
        <Card
            elevation={4}
            sx={{
                p: 3,
                px:5,
                textAlign: 'center',
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: alpha(config.color, 0.1),
                border: `1px solid ${alpha(config.color, 0.3)}`,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: `0 8px 24px ${alpha(config.color, 0.2)}`,
                }
            }}
        >
            <Box
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: config.gradient,
                    color: '#fff',
                    boxShadow: `0 4px 12px ${alpha(config.color, 0.4)}`,
                }}
            >
                <Icon size={32} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: config.color, mb: 1 }}>
                {count}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                {status.toUpperCase()}
            </Typography>
        </Card>
    );
};

export default StatusCard;