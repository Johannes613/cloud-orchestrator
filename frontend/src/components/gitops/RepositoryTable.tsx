// File: src/components/gitops/RepositoryTable.tsx

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Link,
    IconButton,
    Tooltip,
    Chip,
    Box,
    Typography,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert
} from '@mui/material';
import { 
    MoreVertical, 
    GitBranch, 
    GitCommit, 
    Settings, 
    Eye, 
    Edit, 
    Trash2, 
    RefreshCw,
    Play,
    Pause,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import StatusBadge from '../deployment/StatusBadge';

interface RepositoryData {
    id: string;
    name: string;
    url: string;
    branch: string;
    autoDeploy: boolean;
    status: 'Active' | 'Inactive' | 'Error' | 'Syncing';
    lastDeployed: string;
    environment: string;
    namespace: string;
    path: string;
    syncInterval: number;
    lastSync: string;
    commitCount: number;
    deploymentCount: number;
}

interface RepositoryTableProps {
    data: RepositoryData[];
    onEdit?: (repo: RepositoryData) => void;
    onDelete?: (repoId: string) => void;
    onToggleAutoDeploy?: (repoId: string, enabled: boolean) => void;
    onSync?: (repoId: string) => void;
    onViewHistory?: (repo: RepositoryData) => void;
}

const RepositoryTable: React.FC<RepositoryTableProps> = ({ 
    data, 
    onEdit, 
    onDelete, 
    onToggleAutoDeploy, 
    onSync,
    onViewHistory 
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRepo, setSelectedRepo] = useState<RepositoryData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, repo: RepositoryData) => {
        setAnchorEl(event.currentTarget);
        setSelectedRepo(repo);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRepo(null);
    };

    const handleEdit = () => {
        if (selectedRepo && onEdit) {
            onEdit(selectedRepo);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const confirmDelete = () => {
        if (selectedRepo && onDelete) {
            onDelete(selectedRepo.id);
        }
        setDeleteDialogOpen(false);
    };

    const handleToggleAutoDeploy = (repo: RepositoryData) => {
        if (onToggleAutoDeploy) {
            onToggleAutoDeploy(repo.id, !repo.autoDeploy);
        }
    };

    const handleSync = (repo: RepositoryData) => {
        if (onSync) {
            onSync(repo.id);
        }
    };

    const handleViewHistory = (repo: RepositoryData) => {
        if (onViewHistory) {
            onViewHistory(repo);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'success';
            case 'Inactive':
                return 'default';
            case 'Error':
                return 'error';
            case 'Syncing':
                return 'info';
            default:
                return 'default';
        }
    };

    const getEnvironmentColor = (environment: string) => {
        switch (environment) {
            case 'production':
                return 'error';
            case 'staging':
                return 'warning';
            case 'development':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <>
            <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Repository</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Branch</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Environment</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Auto-Deploy</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Last Deployed</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Stats</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((repo) => (
                                <TableRow 
                                    key={repo.id}
                                    sx={{ 
                                        '&:hover': { backgroundColor: '#f8f9fa' },
                                        cursor: 'pointer'
                                    }}
                                >
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {repo.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                {repo.url}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <GitBranch size={14} />
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                {repo.branch}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={repo.environment} 
                                            size="small"
                                            color={getEnvironmentColor(repo.environment) as any}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={repo.status === 'Active' ? 'Success' : repo.status === 'Error' ? 'Failed' : 'Pending'} />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={repo.autoDeploy}
                                            onChange={() => handleToggleAutoDeploy(repo)}
                                            size="small"
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatTimestamp(repo.lastDeployed)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatTimestamp(repo.lastSync)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1} flexWrap="wrap">
                                            <Chip 
                                                icon={<GitCommit size={12} />}
                                                label={repo.commitCount}
                                                size="small"
                                                variant="outlined"
                                            />
                                            <Chip 
                                                icon={<GitBranch size={12} />}
                                                label={repo.deploymentCount}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            <Tooltip title="Sync Now">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleSync(repo)}
                                                    disabled={repo.status === 'Syncing'}
                                                    sx={{ color: '#5E6AD2' }}
                                                >
                                                    <RefreshCw size={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View History">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewHistory(repo)}
                                                    sx={{ color: '#666' }}
                                                >
                                                    <Eye size={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="More Actions">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleMenuClick(e, repo)}
                                                    sx={{ color: '#666' }}
                                                >
                                                    <MoreVertical size={16} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: 200
                    }
                }}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <Edit size={16} />
                    </ListItemIcon>
                    <ListItemText>Edit Repository</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => selectedRepo && handleViewHistory(selectedRepo)}>
                    <ListItemIcon>
                        <Eye size={16} />
                    </ListItemIcon>
                    <ListItemText>View History</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => selectedRepo && window.open(selectedRepo.url, '_blank')}>
                    <ListItemIcon>
                        <ExternalLink size={16} />
                    </ListItemIcon>
                    <ListItemText>Open in Git</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: '#F44336' }}>
                    <ListItemIcon>
                        <Trash2 size={16} />
                    </ListItemIcon>
                    <ListItemText>Delete Repository</ListItemText>
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ color: '#5E6AD2', fontWeight: 'bold' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <AlertCircle size={24} color="#F44336" />
                        Delete Repository
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            This action cannot be undone. All deployment history and configurations will be permanently deleted.
                        </Typography>
                    </Alert>
                    <Typography variant="body1" gutterBottom>
                        Are you sure you want to delete the repository <strong>{selectedRepo?.name}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmDelete}
                        variant="contained"
                        color="error"
                        startIcon={<Trash2 size={16} />}
                    >
                        Delete Repository
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default RepositoryTable;
