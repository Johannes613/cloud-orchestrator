// File: src/components/logs/LogsTable.tsx

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Box,
    Typography,
    Chip,
    TablePagination
} from '@mui/material';
import { Eye, Copy, ExternalLink } from 'lucide-react';
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

interface LogsTableProps {
    data: LogData[];
    onLogClick?: (log: LogData) => void;
}

const LogsTable: React.FC<LogsTableProps> = ({ data, onLogClick }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const truncateMessage = (message: string, maxLength: number = 100) => {
        if (message.length <= maxLength) return message;
        return message.substring(0, maxLength) + '...';
    };

    const getRowStyle = (level: string) => {
        const baseStyle = {
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
                backgroundColor: '#f8f9fa'
            }
        };

        if (level === 'ERROR') {
            return {
                ...baseStyle,
                backgroundColor: '#fff5f5',
                '&:hover': {
                    backgroundColor: '#ffe8e8'
                }
            };
        }

        if (level === 'WARN') {
            return {
                ...baseStyle,
                backgroundColor: '#fffbf0',
                '&:hover': {
                    backgroundColor: '#fff3d9'
                }
            };
        }

        return baseStyle;
    };

    const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                            <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Timestamp</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Level</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Source</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Message</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((log, index) => (
                            <TableRow 
                                key={index}
                                onClick={() => onLogClick?.(log)}
                                sx={getRowStyle(log.level)}
                            >
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                    {formatTimestamp(log.timestamp)}
                                </TableCell>
                                <TableCell>
                                    <LogLevelBadge level={log.level} />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={log.source} 
                                        size="small" 
                                        variant="outlined"
                                        sx={{ 
                                            borderColor: 'black',
                                            color: 'black',
                                            backgroundColor: '#F0F2FF'
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ maxWidth: 400 }}>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        {truncateMessage(log.message)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" gap={1}>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onLogClick?.(log);
                                                }}
                                                sx={{ color: 'black' }}
                                            >
                                                <Eye size={16} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Copy Message">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(log.message);
                                                }}
                                                sx={{ color: '#666' }}
                                            >
                                                <Copy size={16} />
                                            </IconButton>
                                        </Tooltip>
                                        {log.traceId && (
                                            <Tooltip title="View Trace">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Handle trace view
                                                    }}
                                                    sx={{ color: '#666' }}
                                                >
                                                    <ExternalLink size={16} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                        color: '#666'
                    }
                }}
            />
        </Paper>
    );
};

export default LogsTable;
