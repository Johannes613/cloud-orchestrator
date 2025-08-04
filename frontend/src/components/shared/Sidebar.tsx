// File: src/components/shared/Sidebar.tsx
import  { useState, useContext,} from 'react';
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
    useMediaQuery
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ColorModeContext } from '../../utils/theme';

// Lucide-react icons
import {
    LayoutDashboard,
    Car,
    GitCompare,
    BarChart3,
    ListTree,
    ChevronLeft,
    ChevronRight,
    Menu,
    BookText,
} from 'lucide-react';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const expandedDrawerWidth = 260;
const collapsedDrawerWidth = 88;

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
        { id: "applications", text: "Applications", icon: <Car />, path: "/applications" },
        { id: "deployments", text: "Deployments", icon: <ListTree />, path: "/deployments" },
        { id: "clusters", text: "Clusters", icon: <GitCompare />, path: "/clusters" },
        { id: "gitops", text: "GitOps", icon: <BookText />, path: "/gitops" },
        { id: "logs", text: "Logs", icon: <BookText />, path: "/logs" },
        { id: "settings", text: "Settings", icon: <BookText />, path: "/settings" },
    ];

    const activePageId = location.pathname.split('/')[1] || '';

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1, pl: 3 }}>
                <BarChart3 size={32} color={theme.palette.primary.main} />
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
                            sx={{ borderRadius: 2, mb: 1 }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: (isCollapsed && isLargeScreen) ? 0 : 3, justifyContent: 'center' }}>
                                {item.icon}
                            </ListItemIcon>
                            {(!isCollapsed || !isLargeScreen) && <ListItemText primary={item.text} />}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
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
                            ? (isCollapsed ? <ChevronRight /> : <ChevronLeft />): <Menu />}
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton sx={{ mr: 1 }} color="inherit" onClick={colorMode?.toggleTheme}>
                        {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
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
                    bgcolor: 'background.default'
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Sidebar;
