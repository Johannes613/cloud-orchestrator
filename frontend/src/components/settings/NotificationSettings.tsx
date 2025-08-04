import React, { useState } from 'react';
import {
    Typography,
    Box,
    Paper,
    Switch,
    FormControlLabel,
    Divider,
    Button,
    Stack
} from '@mui/material';
import { Save } from 'lucide-react';

/**
 * Notification settings component for managing user notification preferences.
 */
const NotificationSettings = () => {
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

    const sections = [
        {
            title: 'General Notifications',
            items: [
                { id: 'emailNotifications', label: 'Email Notifications' },
                { id: 'pushNotifications', label: 'Push Notifications' },
            ]
        },
        {
            title: 'Application Alerts',
            items: [
                { id: 'applicationAlerts', label: 'Application Status Changes' },
                { id: 'deploymentUpdates', label: 'Deployment Updates' },
                { id: 'securityAlerts', label: 'Security Alerts' },
                { id: 'performanceAlerts', label: 'Performance Alerts' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { id: 'weeklyReports', label: 'Weekly Reports' },
                { id: 'monthlyReports', label: 'Monthly Reports' },
            ]
        }
    ];

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
            <Stack spacing={4}>
                {sections.map((section, index) => (
                    <React.Fragment key={section.title}>
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                                {section.title}
                            </Typography>
                            <Stack spacing={2} mt={1}>
                                {section.items.map(item => (
                                    <FormControlLabel
                                        key={item.id}
                                        control={
                                            <Switch
                                                checked={settings[item.id as keyof typeof settings]}
                                                onChange={() => handleToggle(item.id)}
                                                color="primary"
                                            />
                                        }
                                        label={item.label}
                                        sx={{ justifyContent: 'space-between', m: 0 }}
                                        labelPlacement="start"
                                    />
                                ))}
                            </Stack>
                        </Box>
                        {index < sections.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </Stack>

            <Box mt={4} textAlign="right">
                <Button variant="contained" startIcon={<Save size={16} />} onClick={handleSave}>
                    Save Settings
                </Button>
            </Box>
        </Paper>
    );
};

export default NotificationSettings;
