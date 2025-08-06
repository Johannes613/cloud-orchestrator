import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingAnimationProps {
  text?: string;
  size?: number;
  color?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  text = "Loading...",
  size = 40,
  color = "#000000" // Default black color
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress
        size={size}
        sx={{
          color: color,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: color,
          fontWeight: 600,
          opacity: 0.8,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default LoadingAnimation; 