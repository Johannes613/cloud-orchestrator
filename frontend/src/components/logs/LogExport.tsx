import React, { useState } from 'react';
import {
    Box,
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Chip
} from '@mui/material';
import { Download, FileText, FileJson, Calendar, Filter } from 'lucide-react';

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

interface LogExportProps {
    logs: LogData[];
    filteredLogs: LogData[];
}

const LogExport: React.FC<LogExportProps> = ({ logs, filteredLogs }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'txt'>('json');
    const [exportRange, setExportRange] = useState<'all' | 'filtered'>('filtered');
    const [fileName, setFileName] = useState('');

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = () => {
        const dataToExport = exportRange === 'filtered' ? filteredLogs : logs;
        const timestamp = new Date().toISOString().split('T')[0];
        const defaultFileName = `logs_${timestamp}`;
        const finalFileName = fileName || defaultFileName;

        switch (exportFormat) {
            case 'json':
                exportAsJSON(dataToExport, finalFileName);
                break;
            case 'csv':
                exportAsCSV(dataToExport, finalFileName);
                break;
            case 'txt':
                exportAsTXT(dataToExport, finalFileName);
                break;
        }

        setExportDialogOpen(false);
        setFileName('');
    };

    const exportAsJSON = (data: LogData[], filename: string) => {
        const jsonContent = JSON.stringify(data, null, 2);
        downloadFile(jsonContent, `${filename}.json`, 'application/json');
    };

    const exportAsCSV = (data: LogData[], filename: string) => {
        const headers = ['Timestamp', 'Level', 'Source', 'Message', 'Trace ID', 'User ID', 'Session ID'];
        const csvContent = [
            headers.join(','),
            ...data.map(log => [
                log.timestamp,
                log.level,
                log.source,
                `"${log.message.replace(/"/g, '""')}"`,
                log.traceId || '',
                log.userId || '',
                log.sessionId || ''
            ].join(','))
        ].join('\n');

        downloadFile(csvContent, `${filename}.csv`, 'text/csv');
    };

    const exportAsTXT = (data: LogData[], filename: string) => {
        const txtContent = data.map(log => 
            `[${log.timestamp}] ${log.level} [${log.source}] ${log.message}`
        ).join('\n');

        downloadFile(txtContent, `${filename}.txt`, 'text/plain');
    };

    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getExportStats = () => {
        const totalLogs = logs.length;
        const filteredLogsCount = filteredLogs.length;
        const exportCount = exportRange === 'filtered' ? filteredLogsCount : totalLogs;

        return {
            total: totalLogs,
            filtered: filteredLogsCount,
            export: exportCount
        };
    };

    const stats = getExportStats();

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<Download size={16} />}
                onClick={handleClick}
                sx={{ 
                    borderColor: 'black', 
                    color: 'black',
                    '&:hover': {
                        borderColor: 'black',
                        backgroundColor: '#F0F2FF'
                    }
                }}
            >
                Export
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: 200
                    }
                }}
            >
                <MenuItem onClick={() => { setExportFormat('json'); setExportDialogOpen(true); handleClose(); }}>
                    <ListItemIcon>
                        <FileJson size={16} />
                    </ListItemIcon>
                    <ListItemText>Export as JSON File</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { setExportFormat('csv'); setExportDialogOpen(true); handleClose(); }}>
                    <ListItemIcon>
                        {/* <FileCsv size={16} /> */}
                    </ListItemIcon>
                    <ListItemText>Export as CSV</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { setExportFormat('txt'); setExportDialogOpen(true); handleClose(); }}>
                    <ListItemIcon>
                        <FileText size={16} />
                    </ListItemIcon>
                    <ListItemText>Export as Text</ListItemText>
                </MenuItem>
            </Menu>

            <Dialog
                open={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ color: 'black', fontWeight: 'bold' }}>
                    Export Logs
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Export Statistics
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            <Chip 
                                label={`Total: ${stats.total}`} 
                                size="small" 
                                variant="outlined"
                            />
                            <Chip 
                                label={`Filtered: ${stats.filtered}`} 
                                size="small" 
                                variant="outlined"
                                color="primary"
                            />
                            <Chip 
                                label={`To Export: ${stats.export}`} 
                                size="small" 
                                color="primary"
                            />
                        </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Export Range</InputLabel>
                            <Select
                                value={exportRange}
                                onChange={(e) => setExportRange(e.target.value as 'all' | 'filtered')}
                                label="Export Range"
                            >
                                <MenuItem value="filtered">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Filter size={16} />
                                        Filtered Logs ({stats.filtered})
                                    </Box>
                                </MenuItem>
                                <MenuItem value="all">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <FileText size={16} />
                                        All Logs ({stats.total})
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Export Format</InputLabel>
                            <Select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv' | 'txt')}
                                label="Export Format"
                            >
                                <MenuItem value="json">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <FileJson size={16} />
                                        JSON (.json)
                                    </Box>
                                </MenuItem>
                                <MenuItem value="csv">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {/* <FileCsv size={16} /> */}
                                        CSV (.csv)
                                    </Box>
                                </MenuItem>
                                <MenuItem value="txt">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <FileText size={16} />
                                        Text (.txt)
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <TextField
                        fullWidth
                        size="small"
                        label="File Name (Optional)"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder={`logs_${new Date().toISOString().split('T')[0]}`}
                        helperText="Leave empty to use default naming"
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setExportDialogOpen(false)} variant="outlined">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleExport}
                        variant="contained"
                        startIcon={<Download size={16} />}
                        sx={{ backgroundColor: 'black' }}
                    >
                        Export
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LogExport; 