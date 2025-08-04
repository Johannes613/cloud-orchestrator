import React from 'react';
import { Box, Paper, Typography, Grid, Chip, LinearProgress } from '@mui/material';
import { GitBranch, GitCommit, GitPullRequest, GitMerge, Activity, Clock } from 'lucide-react';

interface GitOpsMetrics {
    totalRepositories: number;
    activeRepositories: number;
    totalDeployments: number;
    successfulDeployments: number;
    failedDeployments: number;
    pendingDeployments: number;
    averageDeploymentTime: number;
    lastSyncTime: string;
}

interface GitOpsDashboardProps {
    metrics: GitOpsMetrics;
}

const GitOpsDashboard: React.FC<GitOpsDashboardProps> = ({ metrics }) => {
    const successRate = metrics.totalDeployments > 0 
        ? (metrics.successfulDeployments / metrics.totalDeployments) * 100 
        : 0;

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Repository Stats */}
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 3, height: 120, position: 'relative' }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box sx={{ 
                            backgroundColor: '#E3F2FD', 
                            p: 1, 
                            borderRadius: 2,
                            color: '#1976D2'
                        }}>
                            <GitBranch size={24} />
                        </Box>
                        <Typography variant="h6" sx={{ color: '#5E6AD2', fontWeight: 'bold' }}>
                            Repositories
                        </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {metrics.totalRepositories}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {metrics.activeRepositories} active
                    </Typography>
                </Paper>
            </Grid>

            {/* Deployment Stats */}
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 3, height: 120, position: 'relative' }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box sx={{ 
                            backgroundColor: '#E8F5E8', 
                            p: 1, 
                            borderRadius: 2,
                            color: '#2E7D32'
                        }}>
                            <GitCommit size={24} />
                        </Box>
                        <Typography variant="h6" sx={{ color: '#5E6AD2', fontWeight: 'bold' }}>
                            Deployments
                        </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {metrics.totalDeployments}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {metrics.pendingDeployments} pending
                    </Typography>
                </Paper>
            </Grid>

            {/* Success Rate */}
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 3, height: 120, position: 'relative' }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box sx={{ 
                            backgroundColor: '#FFF3E0', 
                            p: 1, 
                            borderRadius: 2,
                            color: '#F57C00'
                        }}>
                            <Activity size={24} />
                        </Box>
                        <Typography variant="h6" sx={{ color: '#5E6AD2', fontWeight: 'bold' }}>
                            Success Rate
                        </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {successRate.toFixed(1)}%
                    </Typography>
                    <LinearProgress 
                        variant="determinate" 
                        value={successRate} 
                        sx={{ 
                            mt: 1,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#E0E0E0',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: successRate > 80 ? '#4CAF50' : successRate > 60 ? '#FF9800' : '#F44336'
                            }
                        }}
                    />
                </Paper>
            </Grid>

            {/* Average Deployment Time */}
            <Grid item xs={12} md={3}>
                <Paper sx={{ p: 3, height: 120, position: 'relative' }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box sx={{ 
                            backgroundColor: '#F3E5F5', 
                            p: 1, 
                            borderRadius: 2,
                            color: '#7B1FA2'
                        }}>
                            <Clock size={24} />
                        </Box>
                        <Typography variant="h6" sx={{ color: '#5E6AD2', fontWeight: 'bold' }}>
                            Avg. Time
                        </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {formatTime(metrics.averageDeploymentTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        per deployment
                    </Typography>
                </Paper>
            </Grid>

            {/* Quick Stats Row */}
            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#5E6AD2', fontWeight: 'bold', mb: 2 }}>
                        Deployment Overview
                    </Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                        <Chip
                            icon={<GitCommit size={16} />}
                            label={`${metrics.successfulDeployments} Successful`}
                            color="success"
                            variant="outlined"
                        />
                        <Chip
                            icon={<GitMerge size={16} />}
                            label={`${metrics.failedDeployments} Failed`}
                            color="error"
                            variant="outlined"
                        />
                        <Chip
                            icon={<GitPullRequest size={16} />}
                            label={`${metrics.pendingDeployments} Pending`}
                            color="warning"
                            variant="outlined"
                        />
                        <Chip
                            icon={<Clock size={16} />}
                            label={`Last sync: ${new Date(metrics.lastSyncTime).toLocaleTimeString()}`}
                            variant="outlined"
                            sx={{ borderColor: '#5E6AD2', color: '#5E6AD2' }}
                        />
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default GitOpsDashboard; 