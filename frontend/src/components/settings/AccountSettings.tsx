import { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Avatar,
    IconButton,
    Grid,
    Stack,
    Alert,
    CircularProgress
} from '@mui/material';
import { Camera, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { firebaseService } from '../../services/firebaseService';

/**
 * Account settings component for managing user profile information.
 */
const AccountSettings = () => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        position: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (currentUser) {
                try {
                    setLoading(true);
                    // Get user profile from Firebase
                    const userProfile = await firebaseService.getUserProfile(currentUser.uid);
                    setFormData({
                        firstName: (userProfile as any)?.firstName || currentUser.displayName?.split(' ')[0] || '',
                        lastName: (userProfile as any)?.lastName || currentUser.displayName?.split(' ').slice(1).join(' ') || '',
                        email: currentUser.email || '',
                        phone: (userProfile as any)?.phone || '',
                        company: (userProfile as any)?.company || '',
                        position: (userProfile as any)?.position || ''
                    });
                } catch (error) {
                    // If no profile exists, use basic user info
                    setFormData({
                        firstName: currentUser.displayName?.split(' ')[0] || '',
                        lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
                        email: currentUser.email || '',
                        phone: '',
                        company: '',
                        position: ''
                    });
                } finally {
                    setLoading(false);
                }
            }
        };

        loadUserProfile();
    }, [currentUser]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!currentUser) return;
        
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            
            await firebaseService.updateUserProfile(currentUser.uid, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                company: formData.company,
                position: formData.position
            });
            
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}
            
            <Stack direction="row" alignItems="center" spacing={3} mb={4}>
                <Box sx={{ position: 'relative' }}>
                    <Avatar sx={{ width: 100, height: 100, fontSize: '2.5rem' }}>
                        {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                    </Avatar>
                    <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            bgcolor: 'background.paper',
                            '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                            },
                        }}
                    >
                        <Camera size={18} />
                    </IconButton>
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{formData.firstName} {formData.lastName}</Typography>
                    <Typography variant="body1" color="text.secondary">{formData.email}</Typography>
                </Box>
            </Stack>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        variant="outlined"
                        disabled // Assuming email is not editable
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Position"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        variant="outlined"
                    />
                </Grid>
            </Grid>

            <Box mt={4} textAlign="right">
                <Button 
                    variant="contained" 
                    startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />} 
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Paper>
    );
};

export default AccountSettings;
