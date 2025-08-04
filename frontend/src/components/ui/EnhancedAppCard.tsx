import { useState } from 'react';
import { Paper, Box, Typography, Avatar, Chip, IconButton, Menu, MenuItem, Tooltip, LinearProgress } from '@mui/material';
import { MoreVertical, Cpu, MemoryStick, Activity, Clock, Users } from 'lucide-react';
import type { Application } from '../../types/application';

interface EnhancedAppCardProps {
    application: Application;
    onAction: (action: string, application: Application) => void;
}

const EnhancedAppCard: React.FC<EnhancedAppCardProps> = ({ application, onAction }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAction = (action: string) => {
        onAction(action, application);
        handleMenuClose();
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, 'default' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning'> = {
            'Running': 'success',
            'Deploying': 'info',
            'Failed': 'error',
            'Stopped': 'default',
            'Pending': 'warning',
            'Archived': 'default'
        };
        return colorMap[status] || 'default';
    };

    const getHealthIcon = (health: string) => {
        const iconMap: Record<string, React.ReactElement> = {
            'Healthy': <Box component="span" sx={{ color: 'success.main', fontSize: 16 }}>●</Box>,
            'Warning': <Box component="span" sx={{ color: 'warning.main', fontSize: 16 }}>●</Box>,
            'Critical': <Box component="span" sx={{ color: 'error.main', fontSize: 16 }}>●</Box>,
            'Unknown': <Box component="span" sx={{ color: 'text.secondary', fontSize: 16 }}>●</Box>
        };
        return iconMap[health] || iconMap['Unknown'];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Calculate usage percentages
    const cpuUsage = (application.metrics.cpu.current / application.metrics.cpu.limit) * 100;
    const memoryUsage = (application.metrics.memory.current / application.metrics.memory.limit) * 100;

    return (
        <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                            {application.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {application.name}
                        </Typography>
                        <Chip 
                            label={application.status} 
                            color={getStatusColor(application.status)} 
                            size="small" 
                        />
                        <Tooltip title={`Health: ${application.health.status}`}>
                            <Box>{getHealthIcon(application.health.status)}</Box>
                        </Tooltip>
                    </Box>
                    
                    {application.description && (
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            {application.description}
                        </Typography>
                    )}

                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                        {application.tags.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" variant="outlined" />
                        ))}
                    </Box>
                </Box>
                
                <IconButton onClick={handleMenuOpen} size="small">
                    <MoreVertical size={16} />
                </IconButton>
            </Box>

            <Box sx={{ flex: 1 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Cpu size={14} />
                        <Typography variant="caption">
                            {cpuUsage.toFixed(1)}%
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <MemoryStick size={14} />
                        <Typography variant="caption">
                            {memoryUsage.toFixed(1)}%
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Activity size={14} />
                        <Typography variant="caption">
                            {application.metrics.requests.perSecond.toFixed(1)} req/s
                        </Typography>
                    </Box>
                </Box>

                <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">CPU</Typography>
                        <Typography variant="caption">{cpuUsage.toFixed(1)}%</Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={cpuUsage} 
                        sx={{ height: 4, borderRadius: 2 }}
                    />
                </Box>

                <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">Memory</Typography>
                        <Typography variant="caption">{memoryUsage.toFixed(1)}%</Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={memoryUsage} 
                        sx={{ mt: 1, height: 4, borderRadius: 2 }}
                    />
                </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                <Box display="flex" alignItems="center" gap={1}>
                    <Clock size={14} />
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(application.created)}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                    <Users size={14} />
                    <Typography variant="caption" color="text.secondary">
                        {application.replicas} replicas
                    </Typography>
                </Box>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => handleAction('view')}>View Details</MenuItem>
                <MenuItem onClick={() => handleAction('logs')}>View Logs</MenuItem>
                <MenuItem onClick={() => handleAction('metrics')}>View Metrics</MenuItem>
                <MenuItem onClick={() => handleAction('edit')}>Edit</MenuItem>
                <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
                    Delete
                </MenuItem>
            </Menu>
        </Paper>
    );
};

export default EnhancedAppCard; 