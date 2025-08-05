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
          // Professional black and white theme
          background: {
            default: mode === 'light' ? '#FAFAFA' : '#0A0A0A',
            paper: mode === 'light' ? '#FFFFFF' : '#1A1A1A',
          },
          primary: {
            main: mode === 'dark' ? '#FFFFFF' : '#000000',
            light: mode === 'dark' ? '#E0E0E0' : '#333333',
            dark: mode === 'dark' ? '#CCCCCC' : '#000000',
          },
          secondary: {
            main: mode === 'dark' ? '#CCCCCC' : '#666666',
            light: mode === 'dark' ? '#999999' : '#999999',
            dark: mode === 'dark' ? '#666666' : '#333333',
          },
          text: {
            primary: mode === 'dark' ? '#FFFFFF' : '#000000',
            secondary: mode === 'dark' ? '#CCCCCC' : '#666666',
          },
          divider: mode === 'dark' ? '#333333' : '#E0E0E0',
          success: {
            main: '#00C851',
            light: '#4CAF50',
            dark: '#007E33',
          },
          warning: {
            main: '#FF9800',
            light: '#FFB74D',
            dark: '#F57C00',
          },
          info: {
            main: '#2196F3',
            light: '#64B5F6',
            dark: '#1976D2',
          },
          error: {
            main: '#F44336',
            light: '#EF5350',
            dark: '#D32F2F',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
          },
          h2: {
            fontWeight: 600,
            fontSize: '2rem',
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
          },
          h5: {
            fontWeight: 500,
            fontSize: '1.25rem',
          },
          h6: {
            fontWeight: 500,
            fontSize: '1.125rem',
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                border: mode === 'dark' ? '1px solid #333333' : '1px solid #E0E0E0',
                boxShadow: 'none',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 8,
                padding: '8px 24px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              },
              contained: {
                backgroundColor: mode === 'dark' ? '#FFFFFF' : '#000000',
                color: mode === 'dark' ? '#000000' : '#FFFFFF',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#E0E0E0' : '#333333',
                },
              },
              outlined: {
                borderColor: mode === 'dark' ? '#FFFFFF' : '#000000',
                color: mode === 'dark' ? '#FFFFFF' : '#000000',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                },
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              root: {
                borderBottom: mode === 'dark' ? '1px solid #333333' : '1px solid #E0E0E0',
              },
              indicator: {
                backgroundColor: mode === 'dark' ? '#FFFFFF' : '#000000',
                height: 3,
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                minHeight: 48,
                '&.Mui-selected': {
                  color: mode === 'dark' ? '#FFFFFF' : '#000000',
                },
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                margin: '2px 8px',
                '&.Mui-selected': {
                  backgroundColor: mode === 'dark' ? '#333333' : '#F5F5F5',
                  color: mode === 'dark' ? '#FFFFFF' : '#000000',
                  '& .MuiListItemIcon-root': {
                    color: mode === 'dark' ? '#FFFFFF' : '#000000',
                  },
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? '#444444' : '#EEEEEE',
                  },
                },
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#222222' : '#F9F9F9',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                border: mode === 'dark' ? '1px solid #333333' : '1px solid #E0E0E0',
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 'none',
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
