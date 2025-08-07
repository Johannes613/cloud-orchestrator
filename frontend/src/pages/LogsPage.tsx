// File: src/pages/LogsPage.tsx
import React, { useState, useMemo } from 'react';
import { 
    Typography, 
    Box, 
    Paper, 
    Tabs, 
    Tab, 
    Chip,
    Container
} from '@mui/material';
import { 
    BarChart3, 
    Activity, 
    FileText, 
    AlertCircle,
    Info
} from 'lucide-react';

// Import components
import LogFilters from '../components/logs/LogFilters';
import LogsTable from '../components/logs/LogsTable';
import LogAnalytics from '../components/logs/LogAnalytics';
import LogExport from '../components/logs/LogExport';
import LogDetailsModal from '../components/logs/LogDetailsModal';
import RealTimeLogs from '../components/logs/RealTimeLogs';

interface LogData {
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    source: string;
    message: string;
    traceId?: string;
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
}

const LogsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [logs, setLogs] = useState<LogData[]>([
        {
            timestamp: '2024-01-15T10:30:00Z',
            level: 'INFO',
            message: 'Application started successfully',
            source: 'app',
            traceId: 'trace-12345',
            userId: 'user-001',
            sessionId: 'session-abc123'
        },
        {
            timestamp: '2024-01-15T10:29:00Z',
            level: 'WARN',
            message: 'High memory usage detected: 85% of available memory in use',
            source: 'monitoring',
            traceId: 'trace-12346',
            userId: 'user-002',
            sessionId: 'session-def456'
        },
        {
            timestamp: '2024-01-15T10:28:00Z',
            level: 'ERROR',
            message: 'Database connection failed: Connection timeout after 30 seconds',
            source: 'database',
            traceId: 'trace-12347',
            userId: 'user-003',
            sessionId: 'session-ghi789'
        },
        {
            timestamp: '2024-01-15T10:27:00Z',
            level: 'DEBUG',
            message: 'Processing user request: GET /api/users/123',
            source: 'api',
            traceId: 'trace-12348',
            userId: 'user-004',
            sessionId: 'session-jkl012'
        },
        {
            timestamp: '2024-01-15T10:26:00Z',
            level: 'INFO',
            message: 'User authentication successful for user: admin@example.com',
            source: 'security',
            traceId: 'trace-12349',
            userId: 'user-005',
            sessionId: 'session-mno345'
        },
        {
            timestamp: '2024-01-15T10:25:00Z',
            level: 'WARN',
            message: 'Cache miss ratio increased to 15% - considering cache warming',
            source: 'cache',
            traceId: 'trace-12350',
            userId: 'user-006',
            sessionId: 'session-pqr678'
        },
        {
            timestamp: '2024-01-15T10:24:00Z',
            level: 'ERROR',
            message: 'Payment processing failed: Invalid card details provided',
            source: 'payment',
            traceId: 'trace-12351',
            userId: 'user-007',
            sessionId: 'session-stu901'
        },
        {
            timestamp: '2024-01-15T10:23:00Z',
            level: 'INFO',
            message: 'Email notification sent successfully to: user@example.com',
            source: 'notification',
            traceId: 'trace-12352',
            userId: 'user-008',
            sessionId: 'session-vwx234'
        }
    ]);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedSource, setSelectedSource] = useState('all');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Modal state
    const [selectedLog, setSelectedLog] = useState<LogData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get unique sources
    const sources = useMemo(() => {
        const uniqueSources = new Set(logs.map(log => log.source));
        return Array.from(uniqueSources).sort();
    }, [logs]);

    // Filter logs based on criteria
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            // Search term filter
            if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }

            // Level filter
            if (selectedLevel !== 'all' && log.level !== selectedLevel) {
                return false;
            }

            // Source filter
            if (selectedSource !== 'all' && log.source !== selectedSource) {
                return false;
            }

            // Date range filter
            if (startDate && new Date(log.timestamp) < startDate) {
                return false;
            }

            if (endDate && new Date(log.timestamp) > endDate) {
                return false;
            }

            return true;
        });
    }, [logs, searchTerm, selectedLevel, selectedSource, startDate, endDate]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedLevel('all');
        setSelectedSource('all');
        setStartDate(null);
        setEndDate(null);
    };

    // Handle log click
    const handleLogClick = (log: LogData) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    // Handle new log from real-time streaming
    const handleNewLog = (newLog: LogData) => {
        setLogs(prev => [newLog, ...prev]);
    };

    // Get log statistics
    const logStats = useMemo(() => {
        const total = logs.length;
        const errors = logs.filter(log => log.level === 'ERROR').length;
        const warnings = logs.filter(log => log.level === 'WARN').length;
        const info = logs.filter(log => log.level === 'INFO').length;
        const debug = logs.filter(log => log.level === 'DEBUG').length;

        return { total, errors, warnings, info, debug };
    }, [logs]);

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                        Application Logs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Monitor and analyze application logs in real-time
                    </Typography>
                </Box>
                
                <Box display="flex" gap={2} alignItems="center">
                    <Chip 
                        icon={<FileText size={16} />}
                        label={`${logStats.total} total logs`}
                        variant="outlined"
                        sx={{ borderColor: 'black', color: 'black' }}
                    />
                    <Chip 
                        icon={<AlertCircle size={16} />}
                        label={`${logStats.errors} errors`}
                        size="small"
                    />
                    <Chip 
                        icon={<Info size={16} />}
                        label={`${logStats.warnings} warnings`}
                        size="small"
                    />
                </Box>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 3 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={(_e, newValue) => setActiveTab(newValue)}
                    sx={{
                        '& .MuiTab-root': {
                            color: '#666',
                            '&.Mui-selected': {
                                color: 'black',
                                fontWeight: 'bold'
                            }
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'black'
                        }
                    }}
                >
                    <Tab 
                        icon={<FileText size={20} />} 
                        label="Logs" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<BarChart3 size={20} />} 
                        label="Analytics" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<Activity size={20} />} 
                        label="Real-time" 
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            {activeTab === 0 && (
                <Box>
                    {/* Filters */}
                    <LogFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedLevel={selectedLevel}
                        setSelectedLevel={setSelectedLevel}
                        selectedSource={selectedSource}
                        setSelectedSource={setSelectedSource}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        onClearFilters={clearFilters}
                        sources={sources}
                    />

                    {/* Export and Stats */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" gap={2} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                                Showing {filteredLogs.length} of {logs.length} logs
                            </Typography>
                            {filteredLogs.length !== logs.length && (
                                <Chip 
                                    label="Filtered" 
                                    size="small" 
                                    color="primary"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                        <LogExport logs={logs} filteredLogs={filteredLogs} />
                    </Box>

                    {/* Logs Table */}
                    <LogsTable 
                        data={filteredLogs} 
                        onLogClick={handleLogClick}
                    />
                </Box>
            )}

            {activeTab === 1 && (
                <Box>
                    <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold', mb: 3 }}>
                        Log Analytics Dashboard
                    </Typography>
                    <LogAnalytics logs={logs} />
                </Box>
            )}

            {activeTab === 2 && (
                <Box>
                    <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold', mb: 3 }}>
                        Real-Time Log Streaming
                    </Typography>
                    <RealTimeLogs onNewLog={handleNewLog} />
                    
                    <Box mt={3}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold', mb: 2 }}>
                            Recent Streamed Logs
                        </Typography>
                        <LogsTable 
                            data={logs.slice(0, 10)} 
                            onLogClick={handleLogClick}
                        />
                    </Box>
                </Box>
            )}

            {/* Log Details Modal */}
            <LogDetailsModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                log={selectedLog}
            />
        </Container>
    );
};

export default LogsPage;
