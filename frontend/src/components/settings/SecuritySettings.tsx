import React, { useState } from 'react';
import {
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    Grid,
    Stack
} from '@mui/material';
import { Save, Shield, Key, Lock } from 'lucide-react';

/**
 * Security settings component for managing authentication and password settings.
 */
const SecuritySettings = () => {
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

    const passwordsMatch = settings.newPassword === settings.confirmPassword;

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
            <Stack spacing={4}>
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <Shield size={20} color="#1976d2" />
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>Authentication</Typography>
                    </Stack>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.twoFactorAuth}
                                onChange={() => handleToggle('twoFactorAuth')}
                                color="primary"
                            />
                        }
                        label="Two-Factor Authentication (2FA)"
                        sx={{ justifyContent: 'space-between', m: 0 }}
                        labelPlacement="start"
                    />
                </Box>

                <Divider />

                <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <Lock size={20} color="#1976d2" />
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>Password Settings</Typography>
                    </Stack>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Session Timeout (minutes)"
                                type="number"
                                value={settings.sessionTimeout}
                                onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Password Expiry (days)"
                                type="number"
                                value={settings.passwordExpiry}
                                onChange={(e) => handleInputChange('passwordExpiry', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Failed Login Attempts"
                                type="number"
                                value={settings.failedLoginAttempts}
                                onChange={(e) => handleInputChange('failedLoginAttempts', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider />

                <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <Key size={20} color="#1976d2" />
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>Change Password</Typography>
                    </Stack>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Current Password"
                                type="password"
                                value={settings.currentPassword}
                                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                value={settings.newPassword}
                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                value={settings.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                variant="outlined"
                                error={!!settings.newPassword && !passwordsMatch}
                                helperText={!!settings.newPassword && !passwordsMatch ? 'Passwords do not match' : ''}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Stack>

            <Box mt={4} textAlign="right">
                <Button variant="contained" startIcon={<Save size={16} />} onClick={handleSave} disabled={!!settings.newPassword && !passwordsMatch}>
                    Save Security Settings
                </Button>
            </Box>
        </Paper>
    );
};

export default SecuritySettings;
