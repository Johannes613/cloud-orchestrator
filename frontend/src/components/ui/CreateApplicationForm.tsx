import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Box,
    Alert
} from '@mui/material';
import { firebaseService } from '../../services/firebaseService';
import { useAuth } from '../../contexts/AuthContext';

interface CreateApplicationFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateApplicationForm: React.FC<CreateApplicationFormProps> = ({
    open,
    onClose,
    onSuccess
}) => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        namespace: 'default',
        image: 'nginx:latest',
        version: '1.0.0',
        environment: 'development',
        replicas: 1,
        tags: [] as string[],
        owner: '',
        team: 'DevOps'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newTag, setNewTag] = useState('');

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            handleInputChange('tags', [...formData.tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setError('Application name is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!currentUser) {
                setError('User not authenticated');
                return;
            }
            
            await firebaseService.createApplication({
                name: formData.name,
                description: formData.description,
                namespace: formData.namespace,
                image: formData.image,
                version: formData.version,
                environment: formData.environment,
                replicas: formData.replicas,
                resources: {
                    cpu: { request: '100m', limit: '500m' },
                    memory: { request: '128Mi', limit: '512Mi' },
                    storage: { size: '1Gi', type: 'SSD' }
                },
                tags: formData.tags,
                owner: formData.owner || 'admin@company.com',
                team: formData.team
            }, currentUser.uid);

            onSuccess();
            onClose();
            // Reset form
            setFormData({
                name: '',
                description: '',
                namespace: 'default',
                image: 'nginx:latest',
                version: '1.0.0',
                environment: 'development',
                replicas: 1,
                tags: [],
                owner: '',
                team: 'DevOps'
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create New Application</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6} component="div">
                        <TextField
                            fullWidth
                            label="Application Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} component="div">
                        <TextField
                            fullWidth
                            label="Namespace"
                            value={formData.namespace}
                            onChange={(e) => handleInputChange('namespace', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} component="div">
                        <TextField
                            fullWidth
                            label="Image"
                            value={formData.image}
                            onChange={(e) => handleInputChange('image', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} component="div">
                        <TextField
                            fullWidth
                            label="Version"
                            value={formData.version}
                            onChange={(e) => handleInputChange('version', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} component="div">
                        <FormControl fullWidth>
                            <InputLabel>Environment</InputLabel>
                            <Select
                                value={formData.environment}
                                label="Environment"
                                onChange={(e) => handleInputChange('environment', e.target.value)}
                            >
                                <MenuItem value="development">Development</MenuItem>
                                <MenuItem value="staging">Staging</MenuItem>
                                <MenuItem value="production">Production</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} component="div">
                        <TextField
                            fullWidth
                            label="Replicas"
                            type="number"
                            value={formData.replicas}
                            onChange={(e) => handleInputChange('replicas', parseInt(e.target.value) || 1)}
                            inputProps={{ min: 1, max: 10 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} component="div">
                        <TextField
                            fullWidth
                            label="Owner"
                            value={formData.owner}
                            onChange={(e) => handleInputChange('owner', e.target.value)}
                            placeholder="admin@company.com"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} component="div">
                        <TextField
                            fullWidth
                            label="Team"
                            value={formData.team}
                            onChange={(e) => handleInputChange('team', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} component="div">
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} component="div">
                        <Box>
                            <TextField
                                fullWidth
                                label="Add Tags"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                placeholder="Press Enter to add tag"
                            />
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {formData.tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => handleRemoveTag(tag)}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !formData.name.trim()}
                >
                    {loading ? 'Creating...' : 'Create Application'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateApplicationForm; 