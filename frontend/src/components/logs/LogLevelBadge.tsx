// File: src/components/logs/LogLevelBadge.tsx
import React from 'react';
import { Chip } from '@mui/material';

interface LogLevelBadgeProps {
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
}

const LogLevelBadge: React.FC<LogLevelBadgeProps> = ({ level }) => {
    const colorMap = {
        'INFO': 'info',
        'WARN': 'warning',
        'ERROR': 'error',
        'DEBUG': 'default',
    };

    const getCustomStyle = (level: string) => {
        switch (level) {
            case 'INFO':
                return {
                    backgroundColor: '#E3F2FD',
                    color: '#1976D2',
                    border: '1px solid #BBDEFB'
                };
            case 'WARN':
                return {
                    backgroundColor: '#FFF3E0',
                    color: '#F57C00',
                    border: '1px solid #FFCC02'
                };
            case 'ERROR':
                return {
                    backgroundColor: '#FFEBEE',
                    color: '#D32F2F',
                    border: '1px solid #FFCDD2'
                };
            case 'DEBUG':
                return {
                    backgroundColor: '#F3E5F5',
                    color: '#7B1FA2',
                    border: '1px solid #E1BEE7'
                };
            default:
                return {};
        }
    };

    return (
        <Chip
            label={level}
            size="small"
            sx={{
                fontWeight: 'bold',
                fontSize: '0.75rem',
                height: 24,
                ...getCustomStyle(level)
            }}
        />
    );
};

export default LogLevelBadge;
