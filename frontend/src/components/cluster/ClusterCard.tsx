// File: src/components/cluster/ClusterCard.tsx
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    LinearProgress,
    IconButton,
    Tooltip,
    Avatar,
} from '@mui/material';
import {
    PlayArrow as RunningIcon,
    Stop as StoppedIcon,
    Settings as SettingsIcon,
    Visibility as ViewIcon,
    Memory as MemoryIcon,
    Storage as StorageIcon,
} from '@mui/icons-material';
import type { Cluster } from '../../services/firebaseService';

interface ClusterCardProps {
    cluster: Cluster;
}

const ClusterCard: React.FC<ClusterCardProps> = ({ cluster }) => {
    const isActive = cluster.status === 'active';
    const cpuUsagePercentage = cluster.cpu.total > 0 ? (cluster.cpu.used / cluster.cpu.total) * 100 : 0;
    const memoryUsagePercentage = cluster.memory.total > 0 ? (cluster.memory.used / cluster.memory.total) * 100 : 0;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'error';
            case 'maintenance':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getUsageColor = (usage: number) => {
        if (usage >= 80) return 'error';
        if (usage >= 60) return 'warning';
        return 'success';
    };

    return (
        <Card 
            elevation={0}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    height: 140,
                    background: `linear-gradient(135deg, #000000 0%, #333333 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1,
                    }}
                >
                    <Chip
                        label={cluster.status}
                        color={getStatusColor(cluster.status) as any}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.3)',
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'white',
                            fontWeight: 700,
                            textAlign: 'center',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        }}
                    >
                        {cluster.name}
                    </Typography>
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                            {cluster.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {cluster.provider} • {cluster.region}
                        </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        {cluster.name.charAt(0)}
                    </Avatar>
                </Box>

                <Box display="flex" gap={2} mb={2}>
                    <Box flex={1}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Nodes
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {cluster.nodes}
                        </Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Applications
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {cluster.applications}
                        </Typography>
                    </Box>
                </Box>

                <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            CPU Usage
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {cpuUsagePercentage.toFixed(1)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={cpuUsagePercentage}
                        color={getUsageColor(cpuUsagePercentage) as any}
                        sx={{ height: 6, borderRadius: 3 }}
                    />
                </Box>

                <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            Memory Usage
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {memoryUsagePercentage.toFixed(1)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={memoryUsagePercentage}
                        color={getUsageColor(memoryUsagePercentage) as any}
                        sx={{ height: 6, borderRadius: 3 }}
                    />
                </Box>

                <Box display="flex" gap={1} mb={2}>
                    <Chip
                        icon={<MemoryIcon />}
                        label={`${cluster.memory.used}GB / ${cluster.memory.total}GB`}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        icon={<StorageIcon />}
                        label={`${cluster.storage.used}GB / ${cluster.storage.total}GB`}
                        size="small"
                        variant="outlined"
                    />
                </Box>
            </CardContent>

            <CardActions sx={{ p: 3, pt: 0 }}>
                <Box display="flex" gap={1} width="100%">
                    <Tooltip title="View cluster details">
                        <IconButton
                            size="small"
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': { backgroundColor: 'action.hover' }
                            }}
                        >
                            <ViewIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Cluster settings">
                        <IconButton
                            size="small"
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': { backgroundColor: 'action.hover' }
                            }}
                        >
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card>
    );
};

export default ClusterCard;
