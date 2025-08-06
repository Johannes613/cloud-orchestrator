import React from 'react';
import { TextField } from '@mui/material';

interface SimpleDatePickerProps {
    label: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
    size?: 'small' | 'medium';
    sx?: any;
}

const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({ 
    label, 
    value, 
    onChange, 
    size = 'small',
    sx = {}
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = event.target.value;
        if (dateValue) {
            onChange(new Date(dateValue));
        } else {
            onChange(null);
        }
    };

    const formatDateForInput = (date: Date | null) => {
        if (!date) return '';
        return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    };

    return (
        <TextField
            type="datetime-local"
            label={label}
            value={formatDateForInput(value)}
            onChange={handleChange}
            size={size}
            sx={{
                minWidth: 180,
                '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                        borderColor: '#5E6AD2',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#5E6AD2',
                    },
                },
                ...sx
            }}
            InputLabelProps={{
                shrink: true,
            }}
        />
    );
};

export default SimpleDatePicker; 