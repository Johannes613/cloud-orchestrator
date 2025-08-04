// File: src/components/gitops/RepositoryTable.tsx
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
import StatusBadge from '../deployment/StatusBadge.tsx';

interface RepositoryData {
    name: string;
    branch: string;
    autoDeploy: boolean;
    status: 'Active' | 'Inactive';
    lastDeployed: string;
}

interface RepositoryTableProps {
    data: RepositoryData[];
}

const RepositoryTable: React.FC<RepositoryTableProps> = ({ data }) => {
    return (
        <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Repository</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Auto-Deploy</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Deployed</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>
                                    <Link component="button" variant="body2">
                                        {row.branch}
                                    </Link>
                                </TableCell>
                                <TableCell>{row.autoDeploy ? 'true' : 'false'}</TableCell>
                                <TableCell>
                                    <StatusBadge status={row.status === 'Active' ? 'Success' : 'Failed'} />
                                </TableCell>
                                <TableCell>{row.lastDeployed}</TableCell>
                                <TableCell>
                                    <Link component="button" variant="body2">
                                        View Details
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

export default RepositoryTable;
