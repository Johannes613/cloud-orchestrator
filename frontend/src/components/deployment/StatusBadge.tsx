// File: src/components/deployment/StatusBadge.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { CheckCircle, XCircle, Clock, Play } from 'lucide-react';

interface StatusBadgeProps {
    status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back';
    showIcon?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
    status, 
    showIcon = true, 
    size = 'small' 
}) => {
    const getStatusConfig = (status: string) => {
        const configs: Record<string, {
            color: string;
            bgColor: string;
            icon: React.ReactNode;
            label: string;
        }> = {
            'completed': {
                color: '#2e7d32',
                bgColor: '#e8f5e8',
                icon: <CheckCircle size={14} />,
                label: 'Completed'
            },
            'failed': {
                color: '#d32f2f',
                bgColor: '#ffebee',
                icon: <XCircle size={14} />,
                label: 'Failed'
            },
            'pending': {
                color: '#ed6c02',
                bgColor: '#fff4e5',
                icon: <Clock size={14} />,
                label: 'Pending'
            },
            'running': {
                color: '#1976d2',
                bgColor: '#e3f2fd',
                icon: <Play size={14} />,
                label: 'Running'
            },
            'rolled_back': {
                color: '#d32f2f',
                bgColor: '#ffebee',
                icon: <XCircle size={14} />,
                label: 'Rolled Back'
            }
        };
        return configs[status] || configs['Pending'];
    };

    const config = getStatusConfig(status);
    
    if (!config) {
        return null; // Return null if status is not recognized
    }
    
    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem',
                fontWeight: 500,
                backgroundColor: config.bgColor,
                color: config.color,
                border: `1px solid ${config.color}20`,
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    backgroundColor: `${config.bgColor}dd`
                }
            }}
        >
            {showIcon && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        animation: status === 'running' ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.5 }
                        }
                    }}
                >
                    {config.icon}
                </Box>
            )}
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}
            >
                {config.label}
            </Typography>
            {size === 'large' && (
                <Box
                    sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: config.color,
                        animation: status === 'running' ? 'pulse 1s infinite' : 'none'
                    }}
                />
            )}
        </Box>
    );
};

export default StatusBadge;
