import React from 'react';
import { Chip } from '@mui/material';

// Define the type for the severity prop
type Severity = 'Low' | 'Medium' | 'High';

// Define the props for the SeverityBadge component
interface SeverityBadgeProps {
    severity: Severity;
}

/**
 * A component to display a colored badge based on a severity level.
 * @param {SeverityBadgeProps} props - The component props.
 * @param {Severity} props.severity - The severity level ('Low', 'Medium', 'High').
 */
const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
    // Map severity string to a Material-UI color prop
    const getColor = (s: Severity) => {
        switch (s) {
            case 'Low':
                return 'success';
            case 'Medium':
                return 'warning';
            case 'High':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Chip
            label={severity}
            size="small"
            color={getColor(severity)}
            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
        />
    );
};

export default SeverityBadge;
