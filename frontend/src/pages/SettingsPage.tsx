// File: src/pages/SettingsPage.tsx
import { Container, Typography, Box } from '@mui/material';
import AccountSettings from '../components/settings/AccountSettings.tsx';
import NotificationSettings from '../components/settings/NotificationSettings.tsx';
import SecuritySettings from '../components/settings/SecuritySettings.tsx';

/**
 * The main Settings page component.
 * It acts as a container for different settings sections, organizing them vertically.
 */
const SettingsPage = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Settings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your account settings, preferences, and security.
                </Typography>
            </Box>

            <AccountSettings />
            <NotificationSettings />
            <SecuritySettings />
        </Container>
    );
};

export default SettingsPage;
