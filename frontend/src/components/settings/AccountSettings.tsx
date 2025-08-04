import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Avatar,
    IconButton,
    Grid,
    Stack
} from '@mui/material';
import { Camera, Save } from 'lucide-react';

/**
 * Account settings component for managing user profile information.
 */
const AccountSettings = () => {
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        company: 'Tech Corp',
        position: 'Senior Developer'
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        console.log('Saving account settings:', formData);
    };

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
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
                <Button variant="contained" startIcon={<Save size={16} />} onClick={handleSave}>
                    Save Changes
                </Button>
            </Box>
        </Paper>
    );
};

export default AccountSettings;
