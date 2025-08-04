// File: src/components/deployment/DeploymentMetrics.tsx
import React from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    LinearProgress,
    Chip
} from '@mui/material';
import { 
    TrendingUp, 
    Clock, 
    CheckCircle, 
    XCircle,
    BarChart3,
    Activity
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

interface DeploymentMetricsProps {
    deployments: Deployment[];
}

const DeploymentMetrics: React.FC<DeploymentMetricsProps> = ({ deployments }) => {
    const getMetrics = () => {
        const total = deployments.length;
        const success = deployments.filter(d => d.status === 'Success').length;
        const failed = deployments.filter(d => d.status === 'Failed').length;
        const deploying = deployments.filter(d => d.status === 'Deploying').length;
        const pending = deployments.filter(d => d.status === 'Pending').length;
        
        const successRate = total > 0 ? (success / total) * 100 : 0;
        const avgDuration = deployments
            .filter(d => d.duration)
            .reduce((acc, d) => acc + (d.duration || 0), 0) / 
            deployments.filter(d => d.duration).length || 0;

        return {
            total,
            success,
            failed,
            deploying,
            pending,
            successRate,
            avgDuration
        };
    };

    const metrics = getMetrics();

    const pieData = [
        { name: 'Success', value: metrics.success, color: '#4caf50' },
        { name: 'Failed', value: metrics.failed, color: '#f44336' },
        { name: 'Deploying', value: metrics.deploying, color: '#2196f3' },
        { name: 'Pending', value: metrics.pending, color: '#ff9800' }
    ].filter(item => item.value > 0);

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            bgcolor: '#1976d2',
            color: 'white',
            height: '100%'
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <BarChart3 size={24} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Deployment Metrics
                    </Typography>
                </Box>

                {/* Success Rate */}
                <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Success Rate
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {metrics.successRate.toFixed(1)}%
                        </Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={metrics.successRate}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#4caf50',
                                borderRadius: 4
                            }
                        }}
                    />
                </Box>

                {/* Pie Chart */}
                <Box mb={3} sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    border: 'none',
                                    borderRadius: 8,
                                    color: 'white'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>

                {/* Stats Grid */}
                <Box display="flex" gap={2} mb={3}>
                    <Box flex={1} textAlign="center" p={2} sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 2 
                    }}>
                        <CheckCircle size={20} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                            {metrics.success}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            Successful
                        </Typography>
                    </Box>
                    <Box flex={1} textAlign="center" p={2} sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 2 
                    }}>
                        <XCircle size={20} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                            {metrics.failed}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            Failed
                        </Typography>
                    </Box>
                </Box>

                {/* Average Duration */}
                <Box mt={3} p={2} sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: 2 
                }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Clock size={16} />
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Average Duration
                        </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatDuration(metrics.avgDuration)}
                    </Typography>
                </Box>

                {/* Environment Distribution */}
                <Box mt={3}>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                        Environment Distribution
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        {Array.from(new Set(deployments.map(d => d.environment))).map(env => {
                            const count = deployments.filter(d => d.environment === env).length;
                            return (
                                <Chip
                                    key={env}
                                    label={`${env}: ${count}`}
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.3)'
                                        }
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DeploymentMetrics; 