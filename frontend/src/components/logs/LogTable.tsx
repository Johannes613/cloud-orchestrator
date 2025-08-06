// File: src/components/logs/LogsTable.tsx

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import LogLevelBadge from './LogLevelBadge.tsx';

interface LogData {
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR';
    source: string;
    message: string;
}

interface LogsTableProps {
    data: LogData[];
}

const LogsTable: React.FC<LogsTableProps> = ({ data }) => {
    return (
        <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Message</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell>{log.timestamp}</TableCell>
                                <TableCell><LogLevelBadge level={log.level} /></TableCell>
                                <TableCell>{log.source}</TableCell>
                                <TableCell>{log.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default LogsTable;
