// File: src/components/application/SeverityBadge.tsx
import React from 'react';
import { Chip } from '@mui/material';

interface SeverityBadgeProps {
    severity: 'High' | 'Medium' | 'Low';
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
    const colorMap = {
        'High': 'error',
        'Medium': 'warning',
        'Low': 'info',
    };

    return (
        <Chip
            label={severity}
            color={colorMap[severity]}
            size="small"
            sx={{ fontWeight: 'bold' }}
        />
    );
};

export default SeverityBadge;
