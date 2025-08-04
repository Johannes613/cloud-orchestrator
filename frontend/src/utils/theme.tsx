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
                    primary: {
                        main: '#5E6AD2',
                    },
                    secondary: {
                        main: '#f50057',
                    },
                    background: {
                        default: mode === 'dark' ? '#121212' : '#f0f2f5',
                        paper: mode === 'dark' ? '#1d1d1d' : '#ffffff',
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
                                    backgroundColor: mode === 'dark' ? '#5E6AD2' : '#E0E7FF',
                                    color: mode === 'dark' ? '#fff' : '#5E6AD2',
                                    '& .MuiListItemIcon-root': {
                                        color: mode === 'dark' ? '#fff' : '#5E6AD2',
                                    },
                                    '&:hover': {
                                        backgroundColor: mode === 'dark' ? '#5E6AD2' : '#E0E7FF',
                                    }
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
