// File: src/components/ui/StatCard.tsx

import { Box, Paper, Typography } from '@mui/material';

// Defining props interface for the StatCard component.
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

/**
 * A reusable card component to display a single statistic.
 * It features an icon, a title, and a value, all wrapped in a Material-UI Paper component.
 */
const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
    <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
        <Box sx={{
            p: 1.5,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                {value}
            </Typography>
        </Box>
    </Paper>
);

export default StatCard;
