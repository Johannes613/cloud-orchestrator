// File: src/pages/LogsPage.tsx
import { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Search, Filter, Download } from 'lucide-react';
import LogsTable from '../components/logs/LogsTable';

const LogsPage: React.FC = () => {
    const [logs] = useState([
        {
            timestamp: '2024-01-15T10:30:00Z',
            level: 'INFO' as const,
            message: 'Application started successfully',
            source: 'app'
        },
        {
            timestamp: '2024-01-15T10:29:00Z',
            level: 'WARN' as const,
            message: 'High memory usage detected',
            source: 'monitoring'
        },
        {
            timestamp: '2024-01-15T10:28:00Z',
            level: 'ERROR' as const,
            message: 'Database connection failed',
            source: 'database'
        }
    ]);

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Application Logs
                </Typography>
                <Box display="flex" gap={1}>
                    <TextField
                        size="small"
                        placeholder="Search logs..."
                        InputProps={{
                            startAdornment: <Search size={16} style={{ marginRight: 8 }} />,
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Level</InputLabel>
                        <Select label="Level" defaultValue="all">
                            <MenuItem value="all">All Levels</MenuItem>
                            <MenuItem value="ERROR">Error</MenuItem>
                            <MenuItem value="WARN">Warning</MenuItem>
                            <MenuItem value="INFO">Info</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Paper sx={{ p: 2 }}>
                <LogsTable data={logs} />
            </Paper>
        </Container>
    );
};

export default LogsPage;
