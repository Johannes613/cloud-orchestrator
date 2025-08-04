// File: src/components/settings/SecuritySettings.tsx
import { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, Switch, FormControlLabel, Divider, Alert } from '@mui/material';
import { Save, Shield, Key, Lock } from 'lucide-react';

const SecuritySettings: React.FC = () => {
    const [settings, setSettings] = useState({
        twoFactorAuth: true,
        sessionTimeout: '30',
        passwordExpiry: '90',
        failedLoginAttempts: '5',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleToggle = (setting: string) => {
        setSettings(prev => ({
            ...prev,
            [setting]: !prev[setting as keyof typeof prev]
        }));
    };

    const handleSave = () => {
        console.log('Saving security settings:', settings);
    };

    return (
        <div className="container mt-5">
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Security Settings
            </Typography>

            <Paper className="p-4 mt-4">
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <Shield size={20} />
                    <Typography variant="h6">Authentication</Typography>
                </Box>

                <Box display="flex" flexDirection="column" gap={2} mb={3}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.twoFactorAuth}
                                onChange={() => handleToggle('twoFactorAuth')}
                            />
                        }
                        label="Two-Factor Authentication"
                    />
                </Box>

                <Divider className="my-4" />

                <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <Lock size={20} />
                    <Typography variant="h6">Password Settings</Typography>
                </Box>

                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <TextField
                            fullWidth
                            label="Session Timeout (minutes)"
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <TextField
                            fullWidth
                            label="Password Expiry (days)"
                            type="number"
                            value={settings.passwordExpiry}
                            onChange={(e) => handleInputChange('passwordExpiry', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <TextField
                            fullWidth
                            label="Failed Login Attempts"
                            type="number"
                            value={settings.failedLoginAttempts}
                            onChange={(e) => handleInputChange('failedLoginAttempts', e.target.value)}
                        />
                    </div>
                </div>

                <Divider className="my-4" />

                <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <Key size={20} />
                    <Typography variant="h6">Change Password</Typography>
                </Box>

                <div className="row mb-4">
                    <div className="col-12 mb-3">
                        <TextField
                            fullWidth
                            label="Current Password"
                            type="password"
                            value={settings.currentPassword}
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            value={settings.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            value={settings.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        />
                    </div>
                </div>

                {settings.newPassword && settings.newPassword !== settings.confirmPassword && (
                    <Alert severity="error" className="mb-3">
                        Passwords do not match
                    </Alert>
                )}

                <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" startIcon={<Save size={16} />} onClick={handleSave}>
                        Save Security Settings
                    </Button>
                </Box>
            </Paper>
        </div>
    );
};

export default SecuritySettings;
