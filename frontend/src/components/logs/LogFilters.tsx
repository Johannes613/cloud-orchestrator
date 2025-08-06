import React from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Chip,
    Stack,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';
import { Search, Filter, X, Calendar, Clock } from 'lucide-react';
import SimpleDatePicker from './SimpleDatePicker';

interface LogFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedLevel: string;
    setSelectedLevel: (level: string) => void;
    selectedSource: string;
    setSelectedSource: (source: string) => void;
    startDate: Date | null;
    setStartDate: (date: Date | null) => void;
    endDate: Date | null;
    setEndDate: (date: Date | null) => void;
    onClearFilters: () => void;
    sources: string[];
}

const LogFilters: React.FC<LogFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedLevel,
    setSelectedLevel,
    selectedSource,
    setSelectedSource,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onClearFilters,
    sources
}) => {
    const hasActiveFilters = searchTerm || selectedLevel !== 'all' || selectedSource !== 'all' || startDate || endDate;

    return (
        <Box sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                    <Filter size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Filters
                </Typography>
                {hasActiveFilters && (
                    <Button
                        size="small"
                        onClick={onClearFilters}
                        startIcon={<X size={16} />}
                        sx={{ color: '#666' }}
                    >
                        Clear All
                    </Button>
                )}
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
                <TextField
                    size="small"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <Search size={16} style={{ marginRight: 8 }} />,
                    }}
                    sx={{ minWidth: 200 }}
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Level</InputLabel>
                    <Select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        label="Level"
                    >
                        <MenuItem value="all">All Levels</MenuItem>
                        <MenuItem value="ERROR">Error</MenuItem>
                        <MenuItem value="WARN">Warning</MenuItem>
                        <MenuItem value="INFO">Info</MenuItem>
                        <MenuItem value="DEBUG">Debug</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Source</InputLabel>
                    <Select
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                        label="Source"
                    >
                        <MenuItem value="all">All Sources</MenuItem>
                        {sources.map((source) => (
                            <MenuItem key={source} value={source}>
                                {source}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <SimpleDatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                />

                <SimpleDatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                />
            </Stack>

            {hasActiveFilters && (
                <Box mt={2}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {searchTerm && (
                            <Chip
                                label={`Search: "${searchTerm}"`}
                                onDelete={() => setSearchTerm('')}
                                size="small"
                                color="primary"
                            />
                        )}
                        {selectedLevel !== 'all' && (
                            <Chip
                                label={`Level: ${selectedLevel}`}
                                onDelete={() => setSelectedLevel('all')}
                                size="small"
                                color="primary"
                            />
                        )}
                        {selectedSource !== 'all' && (
                            <Chip
                                label={`Source: ${selectedSource}`}
                                onDelete={() => setSelectedSource('all')}
                                size="small"
                                color="primary"
                            />
                        )}
                        {startDate && (
                            <Chip
                                label={`From: ${startDate.toLocaleString()}`}
                                onDelete={() => setStartDate(null)}
                                size="small"
                                color="primary"
                            />
                        )}
                        {endDate && (
                            <Chip
                                label={`To: ${endDate.toLocaleString()}`}
                                onDelete={() => setEndDate(null)}
                                size="small"
                                color="primary"
                            />
                        )}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default LogFilters; 