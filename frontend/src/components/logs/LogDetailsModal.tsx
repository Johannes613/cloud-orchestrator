import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Paper,
    Grid
} from '@mui/material';
import { X, Copy } from 'lucide-react';
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

interface LogDetailsModalProps {
    open: boolean;
    onClose: () => void;
    log: LogData | null;
}

const LogDetailsModal: React.FC<LogDetailsModalProps> = ({ open, onClose, log }) => {
    if (!log) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minHeight: '60vh'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pb: 1
            }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                        Log Details
                    </Typography>
                    <LogLevelBadge level={log.level} />
                </Box>
                <Button
                    onClick={onClose}
                    sx={{ minWidth: 'auto', p: 1 }}
                >
                    <X size={20} />
                </Button>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                            <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
                                Message
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                fontFamily: 'monospace', 
                                backgroundColor: '#fff',
                                p: 2,
                                borderRadius: 1,
                                border: '1px solid #e0e0e0'
                            }}>
                                {log.message}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
                                Basic Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Timestamp
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        {formatTimestamp(log.timestamp)}
                                    </Typography>
                                </Box>
                                
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Source
                                    </Typography>
                                    <Typography variant="body2">
                                        {log.source}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Level
                                    </Typography>
                                    <LogLevelBadge level={log.level} />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
                                Context Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {log.traceId && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Trace ID
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                {log.traceId}
                                            </Typography>
                                            <Button
                                                size="small"
                                                onClick={() => copyToClipboard(log.traceId!)}
                                                sx={{ minWidth: 'auto', p: 0.5 }}
                                            >
                                                <Copy size={14} />
                                            </Button>
                                        </Box>
                                    </Box>
                                )}

                                {log.userId && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            User ID
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {log.userId}
                                        </Typography>
                                    </Box>
                                )}

                                {log.sessionId && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Session ID
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {log.sessionId}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
                                    Metadata
                                </Typography>
                                <Box sx={{ 
                                    backgroundColor: '#fff',
                                    p: 2,
                                    borderRadius: 1,
                                    border: '1px solid #e0e0e0',
                                    maxHeight: 200,
                                    overflow: 'auto'
                                }}>
                                    <pre style={{ 
                                        margin: 0, 
                                        fontFamily: 'monospace',
                                        fontSize: '0.875rem',
                                        color: '#333'
                                    }}>
                                        {JSON.stringify(log.metadata, null, 2)}
                                    </pre>
                                </Box>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} variant="outlined">
                    Close
                </Button>
                <Button 
                    variant="contained" 
                    onClick={() => copyToClipboard(JSON.stringify(log, null, 2))}
                    startIcon={<Copy size={16} />}
                    sx={{ backgroundColor: 'black' }}
                >
                    Copy Full Log
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LogDetailsModal; 