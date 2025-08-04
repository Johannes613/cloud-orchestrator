// File: src/components/shared/Sidebar.tsx
import { useState, useContext } from 'react';
import type { ReactNode } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
    Divider
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ColorModeContext } from '../../utils/theme';

// Lucide-react icons for a more professional look
import {
  LayoutDashboard,
  Rocket,
  CloudUpload,
  Package, // ✅ use this instead of Cube
  GitFork,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
} from 'lucide-react';


import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const expandedDrawerWidth = 260;
const collapsedDrawerWidth = 88;

/**
 * Custom SVG for the app logo, providing a more unique and professional branding.
 * @param props SVG properties
 * @returns React.ReactNode
 */
const AppLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
    </svg>
);

const Sidebar = ({ children }: { children: ReactNode }) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const location = useLocation();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    const handleDrawerToggle = () => {
        if (isLargeScreen) {
            setIsCollapsed(!isCollapsed);
        } else {
            setMobileOpen(!mobileOpen);
        }
    };

    const navItems = [
        { id: "", text: "Dashboard", icon: <LayoutDashboard />, path: "/" },
        { id: "applications", text: "Applications", icon: <Rocket />, path: "/applications" },
        { id: "deployments", text: "Deployments", icon: <CloudUpload />, path: "/deployments" },
{ id: "clusters", text: "Clusters", icon: <Package />, path: "/clusters" },
        { id: "gitops", text: "GitOps", icon: <GitFork />, path: "/gitops" },
        { id: "logs", text: "Logs", icon: <ScrollText />, path: "/logs" },
    ];

    const activePageId = location.pathname.split('/')[1] || '';

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1, pl: 3 }}>
                <AppLogo color={theme.palette.primary.main} />
                {(!isCollapsed || !isLargeScreen) && (
                    <Typography variant="h5" component="div" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                        Orchestrator
                    </Typography>
                )}
            </Toolbar>
            <List sx={{ px: 2, py: 1, flexGrow: 1 }}>
                {navItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            selected={activePageId === item.id}
                            onClick={() => !isLargeScreen && setMobileOpen(false)}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                '&.Mui-selected': {
                                    backgroundColor: theme.palette.action.selected,
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: (isCollapsed && isLargeScreen) ? 0 : 3, justifyContent: 'center' }}>
                                {item.icon}
                            </ListItemIcon>
                            {(!isCollapsed || !isLargeScreen) && <ListItemText primary={item.text} />}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ mt: 'auto', p: 2 }}>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to="/settings"
                            selected={activePageId === 'settings'}
                            onClick={() => !isLargeScreen && setMobileOpen(false)}
                            sx={{ borderRadius: 2, mb: 1 }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: (isCollapsed && isLargeScreen) ? 0 : 3, justifyContent: 'center' }}>
                                <Settings />
                            </ListItemIcon>
                            {(!isCollapsed || !isLargeScreen) && <ListItemText primary="Settings" />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ borderRadius: 2, mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 0, mr: (isCollapsed && isLargeScreen) ? 0 : 3, justifyContent: 'center' }}>
                                <LogOut />
                            </ListItemIcon>
                            {(!isCollapsed || !isLargeScreen) && <ListItemText primary="Logout" />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={colorMode?.toggleTheme} sx={{ borderRadius: 2 }}>
                            <ListItemIcon sx={{ minWidth: 0, mr: (isCollapsed && isLargeScreen) ? 0 : 3, justifyContent: 'center' }}>
                                {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                            </ListItemIcon>
                            {(!isCollapsed || !isLargeScreen) && <ListItemText primary={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"} />}
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );

    const currentDrawerWidth = isCollapsed && isLargeScreen ? collapsedDrawerWidth : expandedDrawerWidth;

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    width: { lg: `calc(100% - ${currentDrawerWidth}px)` },
                    ml: { lg: `${currentDrawerWidth}px` },
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, color: theme.palette.text.primary }}
                    >
                        {isLargeScreen
                            ? (isCollapsed ? <ChevronRight /> : <ChevronLeft />) : <Menu />}
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { lg: currentDrawerWidth }, flexShrink: { lg: 0 } }}
            >
                <Drawer
                    variant={isLargeScreen ? "permanent" : "temporary"}
                    open={isLargeScreen || mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: isLargeScreen ? currentDrawerWidth : expandedDrawerWidth,
                            borderRight: 'none',
                            overflowX: 'hidden',
                            transition: theme.transitions.create("width", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                            bgcolor: theme.palette.background.paper,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { lg: `calc(100% - ${currentDrawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: theme.palette.background.default
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Sidebar;
