// File: src/components/settings/NotificationSettings.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Switch, FormControlLabel } from '@mui/material';

/**
 * Component for the Notification Settings section.
 * It provides toggle switches for email and in-app notifications.
 */
const NotificationSettings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [inAppNotifications, setInAppNotifications] = useState(true);

    const handleSave = () => {
        // Handle saving notification preferences here
        console.log('Saving notification preferences:', { emailNotifications, inAppNotifications });
    };

    return (
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" component="h2" mb={2} sx={{ fontWeight: 'bold' }}>
                Notifications
            </Typography>
            <Box mb={2}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            name="emailNotifications"
                        />
                    }
                    label={
                        <Box>
                            <Typography variant="body1">Email Notifications</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Receive email notifications for important events and alerts.
                            </Typography>
                        </Box>
                    }
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        m: 0,
                        '& .MuiFormControlLabel-label': { flexGrow: 1, ml: 2 }
                    }}
                />
            </Box>
            <Box mb={2}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={inAppNotifications}
                            onChange={(e) => setInAppNotifications(e.target.checked)}
                            name="inAppNotifications"
                        />
                    }
                    label={
                        <Box>
                            <Typography variant="body1">In-App Notifications</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Receive in-app notifications for real-time updates.
                            </Typography>
                        </Box>
                    }
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        m: 0,
                        '& .MuiFormControlLabel-label': { flexGrow: 1, ml: 2 }
                    }}
                />
            </Box>
            <Button variant="contained" onClick={handleSave}>
                Save Preferences
            </Button>
        </Paper>
    );
};

export default NotificationSettings;
