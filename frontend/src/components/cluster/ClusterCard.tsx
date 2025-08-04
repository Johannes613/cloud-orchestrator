// File: src/components/cluster/ClusterCard.tsx

import {
    Paper,
    Box,
    Typography,
    Button,
} from '@mui/material';

interface ClusterCardProps {
    id: string;
    name: string;
    status: string;
    nodes: number;
    pods: number;
    cpuUsage: string;
    memoryUsage: string;
    image: string;
}

const ClusterCard: React.FC<ClusterCardProps> = ({ name, status, nodes, pods, cpuUsage, memoryUsage, image }) => {
    return (
        <Paper
            elevation={1}
            sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                p: 2,
            }}
        >
            <Box
                component="img"
                sx={{
                    height: 128,
                    width: 128,
                    maxHeight: { xs: 128, md: 128 },
                    maxWidth: { xs: 128, md: 128 },
                    borderRadius: 2,
                    objectFit: 'cover',
                    mr: 3,
                }}
                alt={`${name} image`}
                src={image}
            />
            <Box flexGrow={1}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {status} {nodes} nodes, {pods} pods
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    CPU Usage: {cpuUsage} | Memory Usage: {memoryUsage}
                </Typography>
            </Box>
            <Button variant="contained">View Details</Button>
        </Paper>
    );
};

export default ClusterCard;
