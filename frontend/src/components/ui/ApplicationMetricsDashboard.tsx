import { Box, Typography, Card, CardContent, LinearProgress, Chip } from '@mui/material';
import { Cpu, MemoryStick, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Application } from '../../types/application';

interface ApplicationMetricsDashboardProps {
    application: Application;
}

const ApplicationMetricsDashboard: React.FC<ApplicationMetricsDashboardProps> = ({ application }) => {
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'Healthy': return 'success';
            case 'Warning': return 'warning';
            case 'Critical': return 'error';
            default: return 'default';
        }
    };

    const getHealthIcon = (status: string) => {
        switch (status) {
            case 'Healthy': return <CheckCircle size={20} />;
            case 'Warning': return <AlertTriangle size={20} />;
            case 'Critical': return <AlertTriangle size={20} />;
            default: return <AlertTriangle size={20} />;
        }
    };

    // Calculate usage percentages
    const cpuUsage = (application.metrics.cpu.current / application.metrics.cpu.limit) * 100;
    const memoryUsage = (application.metrics.memory.current / application.metrics.memory.limit) * 100;
    const successRate = ((application.metrics.requests.total - application.metrics.requests.errors) / application.metrics.requests.total) * 100;
    const errorRate = (application.metrics.requests.errors / application.metrics.requests.total) * 100;

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Application Metrics</Typography>
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3}>
                {/* Health Status Card */}
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            {getHealthIcon(application.health.status)}
                            <Typography variant="h6">Health Status</Typography>
                        </Box>
                        <Chip 
                            label={application.health.status} 
                            color={getHealthColor(application.health.status) as any}
                            size="small"
                        />
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            Last check: {new Date(application.health.lastCheck).toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>

                {/* CPU Usage Card */}
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Cpu size={20} />
                            <Typography variant="h6">CPU Usage</Typography>
                        </Box>
                        <Typography variant="h4" color="primary">
                            {cpuUsage.toFixed(1)}%
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                            <Typography variant="caption" color="text.secondary">
                                Current: {application.metrics.cpu.current} cores
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Limit: {application.metrics.cpu.limit} cores
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={cpuUsage} 
                            sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        />
                    </CardContent>
                </Card>

                {/* Memory Usage Card */}
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <MemoryStick size={20} />
                            <Typography variant="h6">Memory Usage</Typography>
                        </Box>
                        <Typography variant="h4" color="primary">
                            {memoryUsage.toFixed(1)}%
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                            <Typography variant="caption" color="text.secondary">
                                Current: {formatBytes(application.metrics.memory.current)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Limit: {formatBytes(application.metrics.memory.limit)}
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={memoryUsage} 
                            sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        />
                    </CardContent>
                </Card>

                {/* Network Activity Card */}
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Activity size={20} />
                            <Typography variant="h6">Network</Typography>
                        </Box>
                        <Typography variant="h4" color="primary">
                            {application.metrics.requests.perSecond.toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            requests/second
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                            <Typography variant="caption" color="text.secondary">
                                In: {formatBytes(application.metrics.network.bytesIn)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Out: {formatBytes(application.metrics.network.bytesOut)}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Request Statistics */}
                <Card sx={{ gridColumn: 'span 2' }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <TrendingUp size={20} />
                            <Typography variant="h6">Request Statistics</Typography>
                        </Box>
                        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
                            <Box textAlign="center">
                                <Typography variant="h5" color="success.main">
                                    {successRate.toFixed(1)}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Success Rate
                                </Typography>
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="h5" color="primary">
                                    {application.metrics.requests.total.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Total Requests
                                </Typography>
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="h5" color="warning.main">
                                    {errorRate.toFixed(1)}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Error Rate
                                </Typography>
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="h5" color="info.main">
                                    {application.metrics.requests.perSecond.toFixed(1)}ms
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Avg Response Time
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Resource Limits */}
                <Card sx={{ gridColumn: 'span 2' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Resource Limits</Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2">CPU</Typography>
                            <Typography variant="body2">
                                {application.resources.cpu.request} / {application.resources.cpu.limit} cores
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={50} 
                            sx={{ mb: 2, height: 4 }}
                        />
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2">Memory</Typography>
                            <Typography variant="body2">
                                {application.resources.memory.request} / {application.resources.memory.limit}
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={50} 
                            sx={{ mb: 2, height: 4 }}
                        />
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2">Storage</Typography>
                            <Typography variant="body2">
                                {application.resources.storage.size} ({application.resources.storage.type})
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={50} 
                            sx={{ height: 4 }}
                        />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ApplicationMetricsDashboard; 