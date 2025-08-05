import { useState, useContext, useEffect, useMemo } from 'react';
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
    Divider,
    Badge,
    Avatar,
    InputBase,
    Menu,
    MenuItem,
    styled,
    alpha,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ColorModeContext } from '../../utils/theme';

// Lucide-react icons for a more professional look
import {
    LayoutDashboard,
    Rocket,
    CloudUpload,
    Package,
    GitFork,
    ScrollText,
    Settings,
    Menu as MenuIcon,
    LogOut,
    Search,
    Bell,
    ChevronDown,
    PanelLeftClose,
    PanelLeftOpen
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

// Styled component for a professional, themed search bar
const SearchBar = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.text.primary, 0.05),
    '&:hover': {
        backgroundColor: alpha(theme.palette.text.primary, 0.1),
    },
    width: '100%',
    maxWidth: 600, // Limit search bar width for a cleaner look on large screens
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

const Sidebar = ({ children }: { children: ReactNode }) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const location = useLocation();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Effect to handle sidebar collapse on screen size change
    useEffect(() => {
        if (!isLargeScreen) {
            setIsCollapsed(false);
        }
    }, [isLargeScreen]);

    const handleDrawerToggle = () => {
        if (isLargeScreen) {
            setIsCollapsed(!isCollapsed);
        } else {
            setMobileOpen(!mobileOpen);
        }
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navItems = useMemo(() => [
        { id: "", text: "Dashboard", icon: <LayoutDashboard />, path: "/" },
        { id: "applications", text: "Applications", icon: <Rocket />, path: "/applications" },
        { id: "deployments", text: "Deployments", icon: <CloudUpload />, path: "/deployments" },
        { id: "clusters", text: "Clusters", icon: <Package />, path: "/clusters" },
        { id: "gitops", text: "GitOps", icon: <GitFork />, path: "/gitops" },
        { id: "logs", text: "Logs", icon: <ScrollText />, path: "/logs" },
    ], []);

    const activePageId = location.pathname.split('/')[1] || '';

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1, pl: 3 }}>
                <AppLogo color={theme.palette.primary.background} />
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
            <Box sx={{ p: 2 }}>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to="/settings"
                            selected={activePageId === 'settings'}
                            onClick={() => !isLargeScreen && setMobileOpen(false)}
                            sx={{ borderRadius: 2, my: 1 }}
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
                        <ListItemButton onClick={colorMode?.toggleTheme} sx={{ borderRadius: 2, mb: 1 }}>
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
                    borderRadius: 0,
                }}
            >
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Left side: Mobile Menu Button or Sidebar Toggle */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            aria-label="toggle sidebar"
                            onClick={handleDrawerToggle}
                            edge="start"
                            sx={{
                                mr: 2,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {isLargeScreen ? (isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />) : <MenuIcon />}
                        </IconButton>
                    </Box>

                    {/* Middle: Search Bar */}
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        <SearchBar>
                            <SearchIconWrapper>
                                <Search />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </SearchBar>
                    </Box>

                    {/* Right side: Notifications and User Menu */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Notification Bell */}
                        <IconButton color="inherit" sx={{ mr: 1, color: theme.palette.text.primary }}>
                            <Badge badgeContent={4} color="error">
                                <Bell />
                            </Badge>
                        </IconButton>

                        {/* User Avatar and Dropdown Menu */}
                        <IconButton
                            onClick={handleMenu}
                            color="inherit"
                            sx={{
                                p: 0,
                                ml: 1,
                                display: 'flex',
                                alignItems: 'center',
                                color: theme.palette.text.primary,
                            }}
                        >
                            <Avatar alt="User Avatar" src="https://i.pravatar.cc/300" sx={{ width: 32, height: 32 }} />
                            <ChevronDown size={16} style={{ marginLeft: theme.spacing(1) }} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                            sx={{
                                '& .MuiPaper-root': {
                                    borderRadius: '8px',
                                    mt: 1,
                                },
                            }}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </Menu>
                    </Box>
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
                            borderRadius: 0,
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
                    p: 2.5,
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
