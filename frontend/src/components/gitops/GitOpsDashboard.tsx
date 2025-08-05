import React from 'react';
import { Box, Paper, Typography, Chip, LinearProgress } from '@mui/material';
import { GitBranch, GitCommit, GitPullRequest, GitMerge, Activity, Clock } from 'lucide-react';
import { Container, Row, Col } from 'react-bootstrap';

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
        <Container className="mb-4">
            {/* Repository Stats */}
            <Row className="g-3">
                <Col xs={12} md={3}>
                    <Paper sx={{ p: 3, height: 160, position: 'relative' }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Box sx={{
                                backgroundColor: '#f4f4f4ff',
                                p: 1,
                                borderRadius: 2,
                                color: 'black'
                            }}>
                                <GitBranch size={24} />
                            </Box>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
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
                </Col>

                {/* Deployment Stats */}
                <Col xs={12} md={3}>
                    <Paper sx={{ p: 3, height: 160, position: 'relative' }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Box sx={{
                                backgroundColor: '#f4f4f4ff',
                                p: 1,
                                borderRadius: 2,
                                color: 'black'
                            }}>
                                <GitCommit size={24} />
                            </Box>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
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
                </Col>

                {/* Success Rate */}
                <Col xs={12} md={3}>
                    <Paper sx={{ p: 3, height: 160, position: 'relative' }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Box sx={{
                                backgroundColor: '#f4f4f4ff',
                                p: 1,
                                borderRadius: 2,
                                color: 'black'
                            }}>
                                <Activity size={24} />
                            </Box>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
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
                                backgroundColor: '#f4f4f4ff',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor:'black'
                                        
                                }
                            }}
                        />
                    </Paper>
                </Col>

                {/* Average Deployment Time */}
                <Col xs={12} md={3}>
                    <Paper sx={{ p: 3, height: 160, position: 'relative' }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Box sx={{
                                backgroundColor: '#f4f4f4ff',
                                p: 1,
                                borderRadius: 2,
                                color: 'black'
                            }}>
                                <Clock size={24} />
                            </Box>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
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
                </Col>
            </Row>

            {/* Quick Stats Row */}
            <Row className="mt-3">
                <Col xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold', mb: 2 }}>
                            Deployment Overview
                        </Typography>
                        <Box className="d-flex flex-wrap gap-2">
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
                                sx={{ borderColor: 'black', color: 'black' }}
                            />
                        </Box>
                    </Paper>
                </Col>
            </Row>
        </Container>
    );
};

export default GitOpsDashboard;
