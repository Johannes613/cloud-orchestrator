import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Tooltip,
    Collapse,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { 
    ChevronDown, 
    ChevronRight, 
    GitCommit, 
    GitBranch, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    Eye,
    RefreshCw
} from 'lucide-react';

interface Deployment {
    id: string;
    commitHash: string;
    commitMessage: string;
    branch: string;
    author: string;
    timestamp: string;
    status: 'success' | 'failed' | 'pending' | 'running';
    duration: number;
    environment: string;
    namespace: string;
    resources: {
        deployments: number;
        services: number;
        configMaps: number;
        secrets: number;
    };
    logs?: string[];
}

interface DeploymentHistoryProps {
    deployments: Deployment[];
    repositoryName: string;
}

const DeploymentHistory: React.FC<DeploymentHistoryProps> = ({ deployments, repositoryName }) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
    const [logDialogOpen, setLogDialogOpen] = useState(false);

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle size={16} color="#4CAF50" />;
            case 'failed':
                return <XCircle size={16} color="#F44336" />;
            case 'running':
                return <RefreshCw size={16} color="#2196F3" />;
            case 'pending':
                return <Clock size={16} color="#FF9800" />;
            default:
                return <AlertCircle size={16} color="#FF9800" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'success';
            case 'failed':
                return 'error';
            case 'running':
                return 'info';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateCommitHash = (hash: string) => {
        return hash.substring(0, 8);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#5E6AD2', fontWeight: 'bold', mb: 2 }}>
                Deployment History - {repositoryName}
            </Typography>

            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Commit</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Branch</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Author</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Environment</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Duration</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Timestamp</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#5E6AD2' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deployments.map((deployment) => (
                                <React.Fragment key={deployment.id}>
                                    <TableRow 
                                        sx={{ 
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: '#f8f9fa' }
                                        }}
                                        onClick={() => toggleRow(deployment.id)}
                                    >
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {getStatusIcon(deployment.status)}
                                                <Chip
                                                    label={deployment.status}
                                                    size="small"
                                                    color={getStatusColor(deployment.status) as any}
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <GitCommit size={14} />
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                    {truncateCommitHash(deployment.commitHash)}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                {deployment.commitMessage}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <GitBranch size={14} />
                                                {deployment.branch}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{deployment.author}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={deployment.environment} 
                                                size="small"
                                                color={deployment.environment === 'production' ? 'error' : 'default'}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {deployment.status === 'running' ? (
                                                <Typography variant="body2" color="text.secondary">
                                                    Running...
                                                </Typography>
                                            ) : (
                                                formatDuration(deployment.duration)
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatTimestamp(deployment.timestamp)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" gap={1}>
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedDeployment(deployment);
                                                        }}
                                                        sx={{ color: '#5E6AD2' }}
                                                    >
                                                        <Eye size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                                {deployment.logs && (
                                                    <Tooltip title="View Logs">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedDeployment(deployment);
                                                                setLogDialogOpen(true);
                                                            }}
                                                            sx={{ color: '#666' }}
                                                        >
                                                            <GitCommit size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {expandedRows.has(deployment.id) ? (
                                                    <ChevronDown size={16} />
                                                ) : (
                                                    <ChevronRight size={16} />
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                            <Collapse in={expandedRows.has(deployment.id)} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ color: '#5E6AD2', fontWeight: 'bold' }}>
                                                        Deployment Resources
                                                    </Typography>
                                                    <Box display="flex" gap={2} flexWrap="wrap">
                                                        <Chip 
                                                            label={`${deployment.resources.deployments} Deployments`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Chip 
                                                            label={`${deployment.resources.services} Services`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Chip 
                                                            label={`${deployment.resources.configMaps} ConfigMaps`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Chip 
                                                            label={`${deployment.resources.secrets} Secrets`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Deployment Details Dialog */}
            <Dialog
                open={!!selectedDeployment && !logDialogOpen}
                onClose={() => setSelectedDeployment(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                {selectedDeployment && (
                    <>
                        <DialogTitle sx={{ color: '#5E6AD2', fontWeight: 'bold' }}>
                            Deployment Details
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#5E6AD2', fontWeight: 'bold' }}>
                                        Commit Information
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                                        Hash: {selectedDeployment.commitHash}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        Message: {selectedDeployment.commitMessage}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        Author: {selectedDeployment.author}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        Branch: {selectedDeployment.branch}
                                    </Typography>
                                </Box>
                                
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#5E6AD2', fontWeight: 'bold' }}>
                                        Deployment Info
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        Environment: {selectedDeployment.environment}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        Namespace: {selectedDeployment.namespace}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        Duration: {formatDuration(selectedDeployment.duration)}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        Timestamp: {formatTimestamp(selectedDeployment.timestamp)}
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, pt: 1 }}>
                            <Button onClick={() => setSelectedDeployment(null)} variant="outlined">
                                Close
                            </Button>
                            {selectedDeployment.logs && (
                                <Button 
                                    onClick={() => setLogDialogOpen(true)}
                                    variant="contained"
                                    startIcon={<GitCommit size={16} />}
                                    sx={{ backgroundColor: '#5E6AD2' }}
                                >
                                    View Logs
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Logs Dialog */}
            <Dialog
                open={logDialogOpen}
                onClose={() => setLogDialogOpen(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ color: '#5E6AD2', fontWeight: 'bold' }}>
                    Deployment Logs
                </DialogTitle>
                <DialogContent>
                    {selectedDeployment?.logs && (
                        <Box sx={{ 
                            backgroundColor: '#f8f9fa',
                            p: 2,
                            borderRadius: 1,
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            maxHeight: 400,
                            overflow: 'auto'
                        }}>
                            {selectedDeployment.logs.map((log, index) => (
                                <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                    {log}
                                </Typography>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setLogDialogOpen(false)} variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeploymentHistory; 