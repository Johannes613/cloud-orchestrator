// File: src/components/deployment/DeploymentTable.tsx

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    Chip,
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import { 
    MoreVertical, 
    Eye, 
    RotateCcw, 
    Download, 
    Settings,
    GitBranch,
    Clock,
    User
} from 'lucide-react';
import StatusBadge from './StatusBadge.tsx';
import { useState } from 'react';
import type { Deployment } from '../../services/firebaseService';
// import type { Application } from '../../types/application';

interface DeploymentTableProps {
    data: Deployment[];
    onRollback?: (deployment: Deployment) => void;
    onViewDetails?: (deployment: Deployment) => void;
}

const DeploymentTable: React.FC<DeploymentTableProps> = ({ data, onRollback, onViewDetails }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, deployment: Deployment) => {
        setAnchorEl(event.currentTarget);
        setSelectedDeployment(deployment);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedDeployment(null);
    };

    const handleAction = (action: string) => {
        if (!selectedDeployment) return;
        
        switch (action) {
            case 'view':
                onViewDetails?.(selectedDeployment);
                break;
            case 'rollback':
                onRollback?.(selectedDeployment);
                break;
            case 'logs':
                // Handle logs action
                // window.open(selectedDeployment.logs_url, '_blank');
                break;
            case 'settings':
                // Handle settings action
                break;
        }
        handleMenuClose();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAuthorInitials = (owner: string) => {
        return owner.split(' ').map(name => name[0]).join('').toUpperCase();
    };

    const getEnvironmentColor = (environment: string) => {
        const colors: Record<string, string> = {
            'production': '#f44336',
            'staging': '#ff9800',
            'dev': '#2196f3'
        };
        return colors[environment] || '#757575';
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <GitBranch size={16} />
                                Application
                            </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Clock size={16} />
                                Deployed At
                            </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <User size={16} />
                                Owner
                            </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            Environment
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            Status
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            Duration
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow 
                            key={row.id}
                            sx={{ 
                                '&:hover': { 
                                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                    transform: 'scale(1.01)',
                                    transition: 'all 0.2s ease-in-out'
                                },
                                cursor: 'pointer'
                            }}
                            onClick={() => onViewDetails?.(row)}
                        >
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {row.applicationName || 'Unknown App'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {row.version}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {formatDate(row.startTime)}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar 
                                        sx={{ 
                                            width: 32, 
                                            height: 32, 
                                            fontSize: '0.75rem',
                                            bgcolor: 'primary.main'
                                        }}
                                    >
                                        {getAuthorInitials('Unknown')}
                                    </Avatar>
                                    <Typography variant="body2">
                                        Unknown
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={row.environment}
                                    size="small"
                                    sx={{
                                        backgroundColor: getEnvironmentColor(row.environment),
                                        color: 'white',
                                        fontWeight: 500
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={row.status} />
                            </TableCell>
                            <TableCell>
                                {false ? (
                                    <Typography variant="body2" color="text.secondary">
                                        Duration not available
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        -
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Tooltip title="View Details">
                                        <IconButton 
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewDetails?.(row);
                                            }}
                                            sx={{ 
                                                color: 'primary.main',
                                                '&:hover': { 
                                                    backgroundColor: 'primary.light',
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            <Eye size={16} />
                                        </IconButton>
                                    </Tooltip>
                                    {row.status === 'completed' && (
                                        <Tooltip title="Rollback">
                                            <IconButton 
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRollback?.(row);
                                                }}
                                                sx={{ 
                                                    color: 'warning.main',
                                                    '&:hover': { 
                                                        backgroundColor: 'warning.light',
                                                        color: 'white'
                                                    }
                                                }}
                                            >
                                                <RotateCcw size={16} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="More Actions">
                                        <IconButton 
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMenuOpen(e, row);
                                            }}
                                        >
                                            <MoreVertical size={16} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        minWidth: 200,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        borderRadius: 2
                    }
                }}
            >
                <MenuItem onClick={() => handleAction('view')}>
                    <ListItemIcon>
                        <Eye size={16} />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleAction('logs')}>
                    <ListItemIcon>
                        <Download size={16} />
                    </ListItemIcon>
                    <ListItemText>View Logs</ListItemText>
                </MenuItem>
                {selectedDeployment?.status === 'completed' && (
                    <>
                        <Divider />
                        <MenuItem onClick={() => handleAction('rollback')}>
                            <ListItemIcon>
                                <RotateCcw size={16} />
                            </ListItemIcon>
                            <ListItemText>Rollback</ListItemText>
                        </MenuItem>
                    </>
                )}
                <Divider />
                <MenuItem onClick={() => handleAction('settings')}>
                    <ListItemIcon>
                        <Settings size={16} />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                </MenuItem>
            </Menu>
        </TableContainer>
    );
};

export default DeploymentTable;
