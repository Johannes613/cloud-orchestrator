// File: src/components/settings/AccountSettings.tsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

/**
 * Component for the Account Settings section.
 * It provides input fields for username, email, and password, with an update button.
 */
const AccountSettings = () => {
    const [username, setUsername] = useState('user123');
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('');

    const handleUpdate = () => {
        // Handle account update logic here
        console.log('Updating account:', { username, email, password });
    };

    return (
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" component="h2" mb={2} sx={{ fontWeight: 'bold' }}>
                Account
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ '& > :not(style)': { mb: 2, width: '100%' } }}>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                />
            </Box>
            <Button variant="contained" onClick={handleUpdate}>
                Update Account
            </Button>
        </Paper>
    );
};

export default AccountSettings;
