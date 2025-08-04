import { useState } from 'react';
import { Paper, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Collapse, Button } from '@mui/material';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { ApplicationFilter, ApplicationStatus } from '../../types/application';

interface ApplicationFiltersProps {
    filters: ApplicationFilter;
    onFiltersChange: (filters: ApplicationFilter) => void;
    onClearFilters: () => void;
}

const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({ filters, onFiltersChange, onClearFilters }) => {
    const [expanded, setExpanded] = useState(false);

    const statusOptions: ApplicationStatus[] = ['Running', 'Deploying', 'Failed', 'Stopped', 'Pending', 'Archived'];
    const environmentOptions = ['development', 'staging', 'production'];
    const teamOptions = ['Frontend', 'Backend', 'DevOps', 'QA', 'Design'];

    const handleFilterChange = (key: keyof ApplicationFilter, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const getActiveFiltersCount = () => {
        return Object.values(filters).filter(value => value !== undefined && value !== '').length;
    };

    const clearAllFilters = () => {
        onClearFilters();
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Filter size={20} />
                    <Typography variant="h6">Filters</Typography>
                    {getActiveFiltersCount() > 0 && (
                        <Chip 
                            label={`${getActiveFiltersCount()} active`} 
                            size="small" 
                            color="primary" 
                        />
                    )}
                </Box>
                <Box display="flex" gap={1}>
                    {getActiveFiltersCount() > 0 && (
                        <Button 
                            size="small" 
                            onClick={clearAllFilters}
                            startIcon={<X size={16} />}
                        >
                            Clear All
                        </Button>
                    )}
                    <IconButton 
                        size="small" 
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </IconButton>
                </Box>
            </Box>
            <Collapse in={expanded}>
                <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            {statusOptions.map(status => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel>Environment</InputLabel>
                        <Select
                            value={filters.environment || ''}
                            onChange={(e) => handleFilterChange('environment', e.target.value)}
                            label="Environment"
                        >
                            <MenuItem value="">All Environments</MenuItem>
                            {environmentOptions.map(env => (
                                <MenuItem key={env} value={env}>{env}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel>Team</InputLabel>
                        <Select
                            value={filters.team || ''}
                            onChange={(e) => handleFilterChange('team', e.target.value)}
                            label="Team"
                        >
                            <MenuItem value="">All Teams</MenuItem>
                            {teamOptions.map(team => (
                                <MenuItem key={team} value={team}>{team}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        size="small"
                        label="Tags"
                        value={filters.tags || ''}
                        onChange={(e) => handleFilterChange('tags', e.target.value)}
                        placeholder="Enter tags (comma separated)"
                    />
                </Box>
            </Collapse>
        </Paper>
    );
};

export default ApplicationFilters; 