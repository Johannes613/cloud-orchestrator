// File: src/pages/LogsPage.tsx
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    InputBase,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { Search as SearchIcon } from 'lucide-react';
import LogsTable from '../components/logs/LogsTable.tsx';

// Mock data for the log entries
const logEntries = [
    { timestamp: '2024-02-12T10:00:00Z', level: 'INFO', source: 'webapp-api', message: 'User "john.doe" logged in successfully.' },
    { timestamp: '2024-02-12T10:00:05Z', level: 'WARN', source: 'db-service', message: 'High latency detected in database query.' },
    { timestamp: '2024-02-12T10:00:10Z', level: 'ERROR', source: 'auth-service', message: 'Failed login attempt for user "admin".' },
    { timestamp: '2024-02-12T10:00:15Z', level: 'INFO', source: 'webapp-api', message: 'Data record created by "jane.smith".' },
    { timestamp: '2024-02-12T10:00:20Z', level: 'WARN', source: 'file-watcher', message: 'File system limit approaching 80%.' },
    { timestamp: '2024-02-12T10:00:25Z', level: 'ERROR', source: 'scheduler', message: 'Job "cleanup-task" failed to complete.' },
];

const LogsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [logLevel, setLogLevel] = useState('ALL');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleLogLevelChange = (event: any) => {
        setLogLevel(event.target.value);
    };

    const filteredLogs = logEntries.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.source.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = logLevel === 'ALL' || log.level === logLevel;
        return matchesSearch && matchesLevel;
    });

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Logs
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    View and filter real-time application and system logs.
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, borderRadius: 2 }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <SearchIcon size={20} style={{ margin: '0 8px' }} />
                </Paper>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="log-level-label">Level</InputLabel>
                    <Select
                        labelId="log-level-label"
                        id="log-level-select"
                        value={logLevel}
                        onChange={handleLogLevelChange}
                        label="Level"
                    >
                        <MenuItem value="ALL">All</MenuItem>
                        <MenuItem value="INFO">INFO</MenuItem>
                        <MenuItem value="WARN">WARN</MenuItem>
                        <MenuItem value="ERROR">ERROR</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <LogsTable data={filteredLogs} />
        </Container>
    );
};

export default LogsPage;
