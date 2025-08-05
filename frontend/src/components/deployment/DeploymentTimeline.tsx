// File: src/components/deployment/DeploymentTimeline.tsx
import React from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Avatar,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    Clock, 
    GitBranch, 
    User, 
    ExternalLink,
    Eye,
    RotateCcw
} from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Application {
    id: string;
    name: string;
    repo_url: string;
    owner: string;
    created_at: string;
}

interface Deployment {
    id: string;
    application_id: string;
    version: string;
    status: 'Pending' | 'Deploying' | 'Success' | 'Failed';
    commit_hash: string;
    environment: 'dev' | 'staging' | 'production';
    deployed_at: string;
    logs_url: string;
    // Additional fields for UI
    application?: Application;
    duration?: number;
}

interface DeploymentTimelineProps {
    deployments: Deployment[];
    onViewDetails?: (deployment: Deployment) => void;
    onRollback?: (deployment: Deployment) => void;
}

const DeploymentTimeline: React.FC<DeploymentTimelineProps> = ({ 
    deployments, 
    onViewDetails, 
    onRollback 
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
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

    const sortedDeployments = [...deployments].sort(
        (a, b) => new Date(b.deployed_at).getTime() - new Date(a.deployed_at).getTime()
    ).slice(0, 5); // Show only last 5 deployments

    return (
        <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            bgcolor: '#f7f6f6ff',
            height: '100%'
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Clock size={24} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Recent Activity
                    </Typography>
                </Box>

                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {sortedDeployments.map((deployment, index) => (
                        <Box key={deployment.id} sx={{ mb: 3 }}>
                            {/* Timeline Item */}
                            <Box display="flex" gap={2}>
                                {/* Timeline Dot */}
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: deployment.status === 'Success' ? '#4caf50' : 
                                                       deployment.status === 'Failed' ? '#f44336' :
                                                       deployment.status === 'Deploying' ? '#2196f3' : '#ff9800',
                                        border: '2px solid white',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                        mt: 1,
                                        flexShrink: 0
                                    }}
                                />
                                
                                {/* Content */}
                                <Box sx={{ flex: 1 }}>
                                    {/* Header */}
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {deployment.application?.name || 'Unknown App'}
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <Avatar 
                                                    sx={{ 
                                                        width: 20, 
                                                        height: 20, 
                                                        fontSize: '0.6rem',
                                                        bgcolor: 'rgba(255,255,255,0.2)'
                                                    }}
                                                >
                                                    {getAuthorInitials(deployment.application?.owner || 'Unknown')}
                                                </Avatar>
                                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                    {deployment.application?.owner || 'Unknown'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box display="flex" gap={1}>
                                            <Tooltip title="View Details">
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => onViewDetails?.(deployment)}
                                                    sx={{ 
                                                        color: 'white',
                                                        '&:hover': { 
                                                            backgroundColor: 'rgba(255,255,255,0.2)' 
                                                        }
                                                    }}
                                                >
                                                    <Eye size={14} />
                                                </IconButton>
                                            </Tooltip>
                                            {deployment.status === 'Success' && (
                                                <Tooltip title="Rollback">
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => onRollback?.(deployment)}
                                                        sx={{ 
                                                            color: 'white',
                                                            '&:hover': { 
                                                                backgroundColor: 'rgba(255,255,255,0.2)' 
                                                            }
                                                        }}
                                                    >
                                                        <RotateCcw size={14} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Status and Environment */}
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <StatusBadge status={deployment.status} size="small" />
                                        <Chip
                                            label={deployment.environment}
                                            size="small"
                                            sx={{
                                                backgroundColor: getEnvironmentColor(deployment.environment),
                                                color: 'white',
                                                fontSize: '0.6rem',
                                                height: 20
                                            }}
                                        />
                                    </Box>

                                    {/* Commit Hash */}
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <GitBranch size={12} />
                                        <Typography variant="caption" sx={{ opacity: 0.8, fontFamily: 'monospace' }}>
                                            {deployment.commit_hash}
                                        </Typography>
                                    </Box>

                                    {/* Duration */}
                                    {deployment.duration && (
                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                            Duration: {Math.floor(deployment.duration / 60)}m {deployment.duration % 60}s
                                        </Typography>
                                    )}

                                    {/* Time */}
                                    <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 0.5 }}>
                                        {formatDate(deployment.deployed_at)}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Timeline Line */}
                            {index < sortedDeployments.length - 1 && (
                                <Box
                                    sx={{
                                        width: 2,
                                        height: 20,
                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                        ml: 1.5,
                                        mt: 1
                                    }}
                                />
                            )}
                        </Box>
                    ))}
                </Box>

                {/* View All Link */}
                {deployments.length > 5 && (
                    <Box textAlign="center" mt={2}>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                opacity: 0.8, 
                                cursor: 'pointer',
                                '&:hover': { opacity: 1 }
                            }}
                        >
                            View all {deployments.length} deployments
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default DeploymentTimeline; 