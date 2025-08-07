import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Switch,
    FormControlLabel,
    Chip,
    IconButton,
    Tooltip,
    Alert
} from '@mui/material';
import { Play, Pause, RotateCcw, Wifi, WifiOff } from 'lucide-react';
import LogLevelBadge from './LogLevelBadge';

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

interface RealTimeLogsProps {
    onNewLog?: (log: LogData) => void;
}

const RealTimeLogs: React.FC<RealTimeLogsProps> = ({ onNewLog }) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [logCount, setLogCount] = useState(0);
    const [lastLog, setLastLog] = useState<LogData | null>(null);
    const [autoScroll, setAutoScroll] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Simulate real-time log generation
    const generateMockLog = (): LogData => {
        const levels: ('INFO' | 'WARN' | 'ERROR' | 'DEBUG')[] = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
        const sources = ['app', 'database', 'api', 'monitoring', 'security', 'cache'];
        const messages = [
            'User authentication successful',
            'Database query executed in 45ms',
            'API endpoint /api/users called',
            'Memory usage at 75%',
            'Cache hit ratio: 92%',
            'Security scan completed',
            'Background job started',
            'File upload completed',
            'Email notification sent',
            'Backup process initiated'
        ];

        const newLog: LogData = {
            timestamp: new Date().toISOString(),
            level: levels[Math.floor(Math.random() * levels.length)] || 'INFO',
            source: sources[Math.floor(Math.random() * sources.length)] || 'unknown',
            message: messages[Math.floor(Math.random() * messages.length)] || 'No message',
            metadata: {
                pod: `pod-${Math.floor(Math.random() * 100)}`,
                container: `container-${Math.floor(Math.random() * 10)}`,
                namespace: 'default'
            }
        };
        return newLog;
    };

    const startStreaming = () => {
        setIsStreaming(true);
        setIsConnected(true);
        setShowAlert(true);
        
        // Simulate WebSocket connection
        intervalRef.current = setInterval(() => {
            const newLog = generateMockLog();
            setLastLog(newLog);
            setLogCount(prev => prev + 1);
            onNewLog?.(newLog);
        }, 2000); // Generate a log every 2 seconds

        // Hide alert after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);
    };

    const stopStreaming = () => {
        setIsStreaming(false);
        setIsConnected(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resetCount = () => {
        setLogCount(0);
        setLastLog(null);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <Box>
            {showAlert && (
                <Alert 
                    severity="success" 
                    sx={{ mb: 2 }}
                    onClose={() => setShowAlert(false)}
                >
                    Real-time log streaming started successfully!
                </Alert>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                        Real-Time Log Stream
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Chip
                            icon={isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                            label={isConnected ? 'Connected' : 'Disconnected'}
                            color={isConnected ? 'success' : 'error'}
                            size="small"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={autoScroll}
                                    onChange={(e) => setAutoScroll(e.target.checked)}
                                    size="small"
                                />
                            }
                            label="Auto-scroll"
                        />
                    </Box>
                </Box>

                <Box display="flex" gap={2} mb={3}>
                    <Button
                        variant={isStreaming ? "outlined" : "contained"}
                        startIcon={isStreaming ? <Pause size={16} /> : <Play size={16} />}
                        onClick={isStreaming ? stopStreaming : startStreaming}
                        sx={{
                            backgroundColor: isStreaming ? 'transparent' : 'black',
                            borderColor: 'black',
                            color: isStreaming ? 'black' : 'white',
                            '&:hover': {
                                backgroundColor: isStreaming ? '#F0F2FF' : 'black'
                            }
                        }}
                    >
                        {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
                    </Button>

                    <Tooltip title="Reset Counter">
                        <IconButton
                            onClick={resetCount}
                            disabled={logCount === 0}
                            sx={{ color: '#666' }}
                        >
                            <RotateCcw size={16} />
                        </IconButton>
                    </Tooltip>

                    <Chip
                        label={`${logCount} logs received`}
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                {lastLog && (
                    <Paper sx={{ p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Latest Log Entry
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                {new Date(lastLog.timestamp).toLocaleTimeString()}
                            </Typography>
                            <LogLevelBadge level={lastLog.level} />
                            <Chip 
                                label={lastLog.source} 
                                size="small" 
                                variant="outlined"
                                sx={{ 
                                    borderColor: 'black',
                                    color: 'black',
                                    backgroundColor: '#F0F2FF'
                                }}
                            />
                        </Box>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {lastLog.message}
                        </Typography>
                    </Paper>
                )}
            </Paper>
        </Box>
    );
};

export default RealTimeLogs; 