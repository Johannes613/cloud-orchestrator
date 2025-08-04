import { Box, Typography, Chip } from '@mui/material';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface SeverityBadgeProps {
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
    const getSeverityColor = (severity: string) => {
        const colorMap: Record<string, 'default' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning'> = {
            'Low': 'success',
            'Medium': 'warning',
            'High': 'error',
            'Critical': 'error'
        };
        return colorMap[severity] || 'default';
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'Critical':
                return <AlertTriangle size={16} />;
            case 'High':
                return <AlertCircle size={16} />;
            case 'Medium':
                return <AlertCircle size={16} />;
            case 'Low':
                return <Info size={16} />;
            default:
                return <Info size={16} />;
        }
    };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            {getSeverityIcon(severity)}
            <Chip 
                label={severity} 
                color={getSeverityColor(severity)} 
                size="small" 
            />
        </Box>
    );
};

export default SeverityBadge;
