// File: src/components/settings/NotificationSettings.tsx
import { useState } from 'react';
import { Container, Typography, Box, Paper, Switch, FormControlLabel, Divider, Button } from '@mui/material';
import { Save } from 'lucide-react';

const NotificationSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        applicationAlerts: true,
        deploymentUpdates: true,
        securityAlerts: true,
        performanceAlerts: false,
        weeklyReports: true,
        monthlyReports: false
    });

    const handleToggle = (setting: string) => {
        setSettings(prev => ({
            ...prev,
            [setting]: !prev[setting as keyof typeof prev]
        }));
    };

    const handleSave = () => {
        console.log('Saving notification settings:', settings);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Notification Settings
            </Typography>
            
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>General Notifications</Typography>
                <Box display="flex" flexDirection="column" gap={2} mb={3}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.emailNotifications}
                                onChange={() => handleToggle('emailNotifications')}
                            />
                        }
                        label="Email Notifications"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.pushNotifications}
                                onChange={() => handleToggle('pushNotifications')}
                            />
                        }
                        label="Push Notifications"
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>Application Alerts</Typography>
                <Box display="flex" flexDirection="column" gap={2} mb={3}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.applicationAlerts}
                                onChange={() => handleToggle('applicationAlerts')}
                            />
                        }
                        label="Application Status Changes"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.deploymentUpdates}
                                onChange={() => handleToggle('deploymentUpdates')}
                            />
                        }
                        label="Deployment Updates"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.securityAlerts}
                                onChange={() => handleToggle('securityAlerts')}
                            />
                        }
                        label="Security Alerts"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.performanceAlerts}
                                onChange={() => handleToggle('performanceAlerts')}
                            />
                        }
                        label="Performance Alerts"
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>Reports</Typography>
                <Box display="flex" flexDirection="column" gap={2} mb={3}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.weeklyReports}
                                onChange={() => handleToggle('weeklyReports')}
                            />
                        }
                        label="Weekly Reports"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.monthlyReports}
                                onChange={() => handleToggle('monthlyReports')}
                            />
                        }
                        label="Monthly Reports"
                    />
                </Box>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button variant="contained" startIcon={<Save size={16} />} onClick={handleSave}>
                        Save Settings
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default NotificationSettings;
