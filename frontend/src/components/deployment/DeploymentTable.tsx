// File: src/components/deployment/DeploymentTable.tsx
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Link
} from '@mui/material';
import StatusBadge from './StatusBadge.tsx';

interface DeploymentData {
    version: string;
    status: 'Success' | 'Failed' | 'Pending';
    deployedAt: string;
}

interface DeploymentTableProps {
    data: DeploymentData[];
}

const DeploymentTable: React.FC<DeploymentTableProps> = ({ data }) => {
    return (
        <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Version</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Deployed At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.version}</TableCell>
                                <TableCell><StatusBadge status={row.status} /></TableCell>
                                <TableCell>{row.deployedAt}</TableCell>
                                <TableCell>
                                    <Link component="button" variant="body2">
                                        Rollback
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default DeploymentTable;
