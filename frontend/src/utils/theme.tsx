// File: src/utils/theme.tsx
import React, { useState, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

// The type for the context has been explicitly defined to prevent TS errors.
export const ColorModeContext = React.createContext<{ toggleTheme: () => void }>({ toggleTheme: () => {} });

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const colorMode = useMemo(
    () => ({
      toggleTheme: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // Defines a layered background for a more professional look.
          background: {
            // Main page background, a very light gray in light mode.
            default: mode === 'light' ? '#F4F6F8' : '#121212',
            // Card/Paper background, a clean white in light mode.
            paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
          },
          primary: {
            main: mode === 'dark' ? '#FFFFFF' : '#1E1E1E', // A vibrant blue for primary actions
          },
          secondary: {
            main: mode === 'dark' ? '#FFFFFF' : '#1E1E1E', // A soft pink for secondary actions
          },
          text: {
            primary: mode === 'dark' ? '#E0E0E0' : '#212121', // Improved contrast for primary text
            secondary: mode === 'dark' ? '#A0A0A0' : '#757575', // Secondary text color
          },
          divider: mode === 'dark' ? '#424242' : '#E0E0E0',
          success: {
            main: '#4CAF50',
          },
          warning: {
            main: '#FF9800',
          },
          info: {
            main: '#2196F3',
          },
          error: {
            main: '#F44336',
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                '&.Mui-selected': {
                  backgroundColor: mode === 'dark' ? '#333333' : '#e0e0e0',
                  color: mode === 'dark' ? '#ffffff' : '#000000',
                  '& .MuiListItemIcon-root': {
                    color: mode === 'dark' ? '#ffffff' : '#000000',
                  },
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? '#444444' : '#d0d0d0',
                  },
                },
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AppThemeProvider;
