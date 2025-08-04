// File: src/components/deployment/StatusBadge.tsx
import { Chip } from '@mui/material';

interface StatusBadgeProps {
    status: 'Success' | 'Failed' | 'Pending';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusColor = (status: string) => {
        const colorMap: Record<string, 'default' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning'> = {
            'Success': 'success',
            'Failed': 'error',
            'Pending': 'warning'
        };
        return colorMap[status] || 'default';
    };

    return (
        <Chip 
            label={status} 
            color={getStatusColor(status)} 
            size="small" 
        />
    );
};

export default StatusBadge;
