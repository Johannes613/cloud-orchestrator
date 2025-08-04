// File: src/components/settings/SecuritySettings.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Switch, FormControlLabel } from '@mui/material';

/**
 * Component for the Security Settings section.
 * It provides a toggle switch for two-factor authentication.
 */
const SecuritySettings = () => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const handleUpdate = () => {
        // Handle updating security settings here
        console.log('Updating security settings:', { twoFactorEnabled });
    };

    return (
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" component="h2" mb={2} sx={{ fontWeight: 'bold' }}>
                Security
            </Typography>
            <Box mb={2}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={twoFactorEnabled}
                            onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                            name="twoFactorEnabled"
                        />
                    }
                    label={
                        <Box>
                            <Typography variant="body1">Two-Factor Authentication</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Enable two-factor authentication for enhanced security.
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
            <Button variant="contained" onClick={handleUpdate}>
                Update Security Settings
            </Button>
        </Paper>
    );
};

export default SecuritySettings;
