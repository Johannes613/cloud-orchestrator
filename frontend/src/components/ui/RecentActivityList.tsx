// File: src/components/ui/RecentActivityList.tsx

import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { Zap, UserPlus, Database, Shield } from 'lucide-react';

interface Activity {
    id: number;
    text: string;
    time: string;
}

interface RecentActivityListProps {
    activities: Activity[];
}

const iconMap: { [key: string]: React.ReactNode } = {
    'Deployment': <Zap size={20} />,
    'New user': <UserPlus size={20} />,
    'Database': <Database size={20} />,
    'Security': <Shield size={20} />,
};

const getIcon = (text: string) => {
    for (const key in iconMap) {
        if (text.startsWith(key)) {
            return iconMap[key];
        }
    }
    return <Zap size={20} />; // Default icon
};

const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => {
    return (
        <Paper elevation={1} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" mb={2} sx={{ fontWeight: 'bold' }}>
                Recent Activities
            </Typography>
            <List disablePadding>
                {activities.map((activity) => (
                    <ListItem key={activity.id} sx={{ px: 0, py: 1 }}>
                        <Box sx={{ mr: 2, color: 'text.secondary' }}>
                            {getIcon(activity.text)}
                        </Box>
                        <ListItemText
                            primary={activity.text}
                            secondary={activity.time}
                            primaryTypographyProps={{ fontWeight: 'bold' }}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default RecentActivityList;
