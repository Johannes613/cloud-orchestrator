// File: src/components/settings/AccountSettings.tsx
import { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, Avatar, IconButton } from '@mui/material';
import { Camera, Save } from 'lucide-react';

const AccountSettings: React.FC = () => {
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
        <div className="container mt-4">
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Account Settings
            </Typography>

            <Paper className="p-4 mt-3">
                <Box display="flex" alignItems="center" gap={3} mb={3}>
                    <Avatar sx={{ width: 80, height: 80, fontSize: '2rem' }}>
                        {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h6">{formData.firstName} {formData.lastName}</Typography>
                        <Typography variant="body2" color="text.secondary">{formData.email}</Typography>
                        <IconButton size="small" sx={{ mt: 1 }}>
                            <Camera size={16} />
                        </IconButton>
                    </Box>
                </Box>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <TextField
                            fullWidth
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <TextField
                            fullWidth
                            label="Phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <TextField
                            fullWidth
                            label="Company"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <TextField
                            fullWidth
                            label="Position"
                            value={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                    </div>
                </div>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button variant="contained" startIcon={<Save size={16} />} onClick={handleSave}>
                        Save Changes
                    </Button>
                </Box>
            </Paper>
        </div>
    );
};

export default AccountSettings;
