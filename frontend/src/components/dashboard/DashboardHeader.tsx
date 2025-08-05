import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';

const DashboardHeader = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate a refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold',  }}>
          Dashboard Page
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Welcome back! Here's what's happening with your applications.
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
        </Typography>
      </Box>
      <IconButton
        onClick={handleRefresh}
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          '&:hover': { bgcolor: 'background.default' },
          transform: isRefreshing ? 'rotate(360deg)' : 'none',
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        <Refresh />
      </IconButton>
    </Box>
  );
};

export default DashboardHeader;