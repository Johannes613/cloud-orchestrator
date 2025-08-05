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

interface ClusterCardProps {
    id: string;
    name: string;
    status: string;
    nodes: number;
    pods: number;
    cpuUsage: string;
    memoryUsage: string;
    image: string;
    region?: string;
    version?: string;
}

const ClusterCard: React.FC<ClusterCardProps> = ({ 
    name, 
    status, 
    nodes, 
    pods, 
    cpuUsage, 
    memoryUsage, 
    image,
    region = 'Unknown',
    version = 'Unknown'
}) => {
    const isActive = status === 'Running';
    const cpuUsageNumber = parseInt(cpuUsage.replace('%', ''));
    const memoryUsageNumber = parseInt(memoryUsage.replace('%', ''));

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'running':
                return 'success';
            case 'stopped':
                return 'error';
            case 'inactive':
                return 'default';
            default:
                return 'warning';
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
                    component="img"
                    src={image}
                    alt={`${name} cluster`}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.8,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        gap: 1,
                    }}
                >
                    <Chip
                        icon={isActive ? <RunningIcon /> : <StoppedIcon />}
                        label={status}
                        size="small"
                        color={getStatusColor(status) as any}
                        sx={{
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                                fontSize: '1rem',
                            },
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        display: 'flex',
                        gap: 1,
                    }}
                >
                    <Chip
                        label={region}
                        size="small"
                        variant="outlined"
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            fontWeight: 500,
                        }}
                    />
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {name}
                    </Typography>
                    <Chip
                        label={`v${version}`}
                        size="small"
                        variant="outlined"
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: 500,
                        }}
                    />
                </Box>

                <Box display="flex" gap={3} mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <StorageIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {nodes} nodes
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <MemoryIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {pods} pods
                        </Typography>
                    </Box>
                </Box>

                <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            CPU Usage
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                            {cpuUsage}
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={cpuUsageNumber}
                        color={getUsageColor(cpuUsageNumber) as any}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'action.hover',
                        }}
                    />
                </Box>

                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Memory Usage
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                            {memoryUsage}
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={memoryUsageNumber}
                        color={getUsageColor(memoryUsageNumber) as any}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'action.hover',
                        }}
                    />
                </Box>
            </CardContent>

            <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                <Tooltip title="View cluster details">
                    <IconButton
                        size="small"
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
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
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default ClusterCard;
