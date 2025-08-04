// File: src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import AppThemeProvider from './utils/theme.tsx';
import "./style.css"; // This file now contains all necessary styling

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AppThemeProvider>
                <App />
            </AppThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
