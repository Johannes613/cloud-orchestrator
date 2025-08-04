// File: src/components/deployment/StatusBadge.tsx
import React from 'react';
import { Chip, Box, Typography } from '@mui/material';
import { CheckCircle, XCircle, Clock, Play, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
    status: 'Pending' | 'Deploying' | 'Success' | 'Failed';
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
            'Success': {
                color: '#2e7d32',
                bgColor: '#e8f5e8',
                icon: <CheckCircle size={14} />,
                label: 'Success'
            },
            'Failed': {
                color: '#d32f2f',
                bgColor: '#ffebee',
                icon: <XCircle size={14} />,
                label: 'Failed'
            },
            'Pending': {
                color: '#ed6c02',
                bgColor: '#fff4e5',
                icon: <Clock size={14} />,
                label: 'Pending'
            },
            'Deploying': {
                color: '#1976d2',
                bgColor: '#e3f2fd',
                icon: <Play size={14} />,
                label: 'Deploying'
            }
        };
        return configs[status] || configs['Pending'];
    };

    const config = getStatusConfig(status);

    const getSizeConfig = (size: string) => {
        const sizes = {
            small: { height: 24, fontSize: '0.75rem', iconSize: 14 },
            medium: { height: 32, fontSize: '0.875rem', iconSize: 16 },
            large: { height: 40, fontSize: '1rem', iconSize: 18 }
        };
        return sizes[size as keyof typeof sizes] || sizes.small;
    };

    const sizeConfig = getSizeConfig(size);

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: config.bgColor,
                color: config.color,
                border: `1px solid ${config.color}20`,
                height: sizeConfig.height,
                fontSize: sizeConfig.fontSize,
                fontWeight: 500,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    backgroundColor: `${config.bgColor}dd`
                },
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {showIcon && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: sizeConfig.iconSize,
                        height: sizeConfig.iconSize
                    }}
                >
                    {config.icon}
                </Box>
            )}
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 600,
                    fontSize: sizeConfig.fontSize,
                    lineHeight: 1,
                    textTransform: 'capitalize'
                }}
            >
                {config.label}
            </Typography>
            
            {/* Animated dot for Deploying status */}
            {status === 'Deploying' && (
                <Box
                    sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: config.color,
                        ml: 0.5,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%': {
                                opacity: 1,
                                transform: 'scale(1)'
                            },
                            '50%': {
                                opacity: 0.5,
                                transform: 'scale(1.2)'
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'scale(1)'
                            }
                        }
                    }}
                />
            )}
        </Box>
    );
};

export default StatusBadge;
