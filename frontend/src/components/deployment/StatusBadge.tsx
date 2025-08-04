// File: src/components/deployment/StatusBadge.tsx
import React from 'react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
    status: 'Success' | 'Failed' | 'Pending';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const colorMap = {
        'Success': 'success',
        'Failed': 'error',
        'Pending': 'info',
    };

    return (
        <Chip
            label={status === 'Success' ? 'Active' : status === 'Failed' ? 'Inactive' : status}
            color={colorMap[status]}
            size="small"
            sx={{ fontWeight: 'bold' }}
        />
    );
};

export default StatusBadge;
