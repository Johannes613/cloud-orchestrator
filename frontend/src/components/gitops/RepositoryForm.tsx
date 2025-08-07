import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Box,
    Typography,
    Chip,
    Alert
} from '@mui/material';
import { GitBranch, GitCommit, AlertCircle } from 'lucide-react';

interface RepositoryFormData {
    name: string;
    url: string;
    branch: string;
    autoDeploy: boolean;
    environment: string;
    namespace: string;
    path: string;
    syncInterval: number;
}

interface RepositoryFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: RepositoryFormData) => void;
    initialData?: RepositoryFormData | undefined;
    mode: 'add' | 'edit';
}

const RepositoryForm: React.FC<RepositoryFormProps> = ({
    open,
    onClose,
    onSubmit,
    initialData,
    mode
}) => {
    const [formData, setFormData] = useState<RepositoryFormData>(
        initialData || {
            name: '',
            url: '',
            branch: 'main',
            autoDeploy: true,
            environment: 'production',
            namespace: 'default',
            path: './',
            syncInterval: 5
        }
    );

    const [errors, setErrors] = useState<Partial<RepositoryFormData>>({});

    const validateForm = () => {
        const newErrors: Partial<RepositoryFormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Repository name is required';
        }

        if (!formData.url.trim()) {
            newErrors.url = 'Repository URL is required';
        } else if (!formData.url.includes('github.com') && !formData.url.includes('gitlab.com')) {
            newErrors.url = 'Please enter a valid GitHub or GitLab URL';
        }

        if (!formData.branch.trim()) {
            newErrors.branch = 'Branch is required';
        }

        if (!formData.namespace.trim()) {
            newErrors.namespace = 'Namespace is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
            onClose();
        }
    };

    const handleChange = (field: keyof RepositoryFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const environments = [
        { value: 'production', label: 'Production', color: 'error' },
        { value: 'staging', label: 'Staging', color: 'warning' },
        { value: 'development', label: 'Development', color: 'info' },
        { value: 'testing', label: 'Testing', color: 'default' }
    ];

    const syncIntervals = [
        { value: 1, label: '1 minute' },
        { value: 5, label: '5 minutes' },
        { value: 15, label: '15 minutes' },
        { value: 30, label: '30 minutes' },
        { value: 60, label: '1 hour' }
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle sx={{ color: 'black', fontWeight: 'bold' }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <GitBranch size={24} />
                    {mode === 'add' ? 'Add Repository' : 'Edit Repository'}
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            Configure your Git repository for automated deployments using GitOps principles.
                        </Typography>
                    </Alert>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                    {/* Basic Information */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold', mb: 2 }}>
                            Basic Information
                        </Typography>
                        
                        <TextField
                            fullWidth
                            label="Repository Name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Repository URL"
                            value={formData.url}
                            onChange={(e) => handleChange('url', e.target.value)}
                            error={!!errors.url}
                            helperText={errors.url || 'e.g., https://github.com/username/repo'}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Branch"
                            value={formData.branch}
                            onChange={(e) => handleChange('branch', e.target.value)}
                            error={!!errors.branch}
                            helperText={errors.branch}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Path"
                            value={formData.path}
                            onChange={(e) => handleChange('path', e.target.value)}
                            helperText="Path to Kubernetes manifests (e.g., ./k8s)"
                            sx={{ mb: 2 }}
                        />
                    </Box>

                    {/* Deployment Configuration */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold', mb: 2 }}>
                            Deployment Configuration
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Environment</InputLabel>
                            <Select
                                value={formData.environment}
                                onChange={(e) => handleChange('environment', e.target.value)}
                                label="Environment"
                            >
                                {environments.map((env) => (
                                    <MenuItem key={env.value} value={env.value}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Chip 
                                                label={env.label} 
                                                size="small" 
                                                color={env.color as any}
                                                variant="outlined"
                                            />
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Namespace"
                            value={formData.namespace}
                            onChange={(e) => handleChange('namespace', e.target.value)}
                            error={!!errors.namespace}
                            helperText={errors.namespace}
                            sx={{ mb: 2 }}
                        />

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Sync Interval</InputLabel>
                            <Select
                                value={formData.syncInterval}
                                onChange={(e) => handleChange('syncInterval', e.target.value)}
                                label="Sync Interval"
                            >
                                {syncIntervals.map((interval) => (
                                    <MenuItem key={interval.value} value={interval.value}>
                                        {interval.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.autoDeploy}
                                    onChange={(e) => handleChange('autoDeploy', e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Auto Deploy"
                            sx={{ mb: 2 }}
                        />

                        {formData.autoDeploy && (
                            <Alert severity="warning" icon={<AlertCircle size={16} />}>
                                <Typography variant="body2">
                                    Auto-deploy will automatically deploy changes when commits are pushed to the selected branch.
                                </Typography>
                            </Alert>
                        )}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    startIcon={<GitCommit size={16} />}
                    sx={{ backgroundColor: 'black' }}
                >
                    {mode === 'add' ? 'Add Repository' : 'Update Repository'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RepositoryForm; 