import { useState } from 'react';
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from '@mui/material';
import { RefreshCw, Download, Search, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import type { ApplicationLog } from '../../types/application';

interface ApplicationLogsViewerProps {
    logs: ApplicationLog[];
    onRefresh: () => void;
}

const ApplicationLogsViewer: React.FC<ApplicationLogsViewerProps> = ({ logs, onRefresh }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState<string>('all');
    const [sourceFilter, setSourceFilter] = useState<string>('all');

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'ERROR': return <AlertTriangle size={16} />;
            case 'WARN': return <AlertCircle size={16} />;
            case 'INFO': return <Info size={16} />;
            default: return <Info size={16} />;
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'ERROR': return 'error';
            case 'WARN': return 'warning';
            case 'INFO': return 'info';
            default: return 'default';
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.source.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
        const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;
        
        return matchesSearch && matchesLevel && matchesSource;
    });

    const uniqueSources = [...new Set(logs.map(log => log.source))];
    const uniqueLevels = [...new Set(logs.map(log => log.level))];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Application Logs</Typography>
                <Box display="flex" gap={1}>
                    <IconButton onClick={onRefresh} size="small">
                        <RefreshCw size={16} />
                    </IconButton>
                    <IconButton size="small">
                        <Download size={16} />
                    </IconButton>
                </Box>
            </Box>

            <Box display="flex" gap={2} mb={3}>
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
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        label="Level"
                    >
                        <MenuItem value="all">All Levels</MenuItem>
                        {uniqueLevels.map(level => (
                            <MenuItem key={level} value={level}>{level}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Source</InputLabel>
                    <Select
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        label="Source"
                    >
                        <MenuItem value="all">All Sources</MenuItem>
                        {uniqueSources.map(source => (
                            <MenuItem key={source} value={source}>{source}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Message</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLogs.map((log, index) => (
                            <TableRow key={index} hover>
                                <TableCell>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        icon={getLevelIcon(log.level)}
                                        label={log.level}
                                        color={getLevelColor(log.level) as any}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{log.source}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        {log.message}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredLogs.length === 0 && (
                <Box textAlign="center" py={4}>
                    <Typography color="text.secondary">
                        No logs found matching the current filters
                    </Typography>
                </Box>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography variant="caption" color="text.secondary">
                    Showing {filteredLogs.length} of {logs.length} logs
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Last updated: {new Date().toLocaleString()}
                </Typography>
            </Box>
        </Box>
    );
};

export default ApplicationLogsViewer; 