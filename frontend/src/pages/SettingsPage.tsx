import React from 'react';
import {
    Container,
    Typography,
    Box
} from '@mui/material';
import AccountSettings from '../components/settings/AccountSettings.tsx';
import NotificationSettings from '../components/settings/NotificationSettings.tsx';
import SecuritySettings from '../components/settings/SecuritySettings.tsx';

/**
 * The main Settings page component.
 * It now displays all settings sections on a single, scrollable page.
 */
const SettingsPage = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, md: 4 } }}>
            <Box mb={4}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    Settings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your account settings, preferences, and security.
                </Typography>
            </Box>

            <Box mt={4}>
                <AccountSettings />
            </Box>

            <Box mt={4}>
                <NotificationSettings />
            </Box>

            <Box mt={4}>
                <SecuritySettings />
            </Box>
        </Container>
    );
};

export default SettingsPage;
