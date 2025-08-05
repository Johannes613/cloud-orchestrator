import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

const StatCard = ({ title, value, Icon, color = 'primary' }) => {
  const theme = useTheme();
  const mainColor =  theme.palette.grey[500];
  const backgroundColor = alpha(mainColor, 0.1);

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
        '&:hover': {
            boxShadow: `0 4px 20px 0 ${alpha(mainColor, 0.2)}`,
            transform: 'translateY(-4px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: backgroundColor,
              color: mainColor,
              width: 56,
              height: 56,
            }}
          >
            <Icon fontSize="large" />
          </Avatar>
          <Box>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;