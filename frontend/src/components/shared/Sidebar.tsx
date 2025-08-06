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
    Chip,
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
    PanelLeftOpen,
    Home,
    Database,
    Server,
    Activity,
} from 'lucide-react';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const expandedDrawerWidth = 280;
const collapsedDrawerWidth = 80;

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
    color: '#000000',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        color: '#000000',
        '&::placeholder': {
            color: '#666666',
            opacity: 1,
        },
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
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const notificationOpen = Boolean(notificationAnchorEl);

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

    const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const navItems = useMemo(() => [
        { id: "", text: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/app" },
        { id: "applications", text: "Applications", icon: <Rocket size={20} />, path: "/app/applications" },
        { id: "deployments", text: "Deployments", icon: <CloudUpload size={20} />, path: "/app/deployments" },
        { id: "clusters", text: "Clusters", icon: <Server size={20} />, path: "/app/clusters" },
        { id: "gitops", text: "GitOps", icon: <GitFork size={20} />, path: "/app/gitops" },
        { id: "logs", text: "Logs", icon: <ScrollText size={20} />, path: "/app/logs" },
    ], []);

    const activePageId = location.pathname.split('/')[2] || '';

    const drawerContent = (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)'
                : 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
        }}>
            {/* Header Section */}
            <Box sx={{ 
                p: 3, 
                borderBottom: '1px solid',
                borderColor: 'divider',
                background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(0, 0, 0, 0.02)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                        p: 1,
                        borderRadius: 2,
                        background: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <AppLogo color={theme.palette.primary.contrastText} />
                    </Box>
                    {(!isCollapsed || !isLargeScreen) && (
                        <Box>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                Orchestrator
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Cloud Native Platform
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Navigation Section */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="overline" sx={{ 
                    px: 2, 
                    mb: 2, 
                    display: 'block',
                    color: 'text.secondary',
                    fontWeight: 600,
                    letterSpacing: 1,
                }}>
                    {(!isCollapsed || !isLargeScreen) ? 'NAVIGATION' : ''}
                </Typography>
                
                <List sx={{ px: 0 }}>
                    {navItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={RouterLink}
                                to={item.path}
                                selected={activePageId === item.id}
                                onClick={() => !isLargeScreen && setMobileOpen(false)}
                                sx={{
                                    borderRadius: 3,
                                    mx: 1,
                                    minHeight: 48,
                                    '&.Mui-selected': {
                                        background: theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.08)'
                                            : 'rgba(0, 0, 0, 0.04)',
                                        color: 'primary.main',
                                        '&:hover': {
                                            background: theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.12)'
                                                : 'rgba(0, 0, 0, 0.08)',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                        },
                                    },
                                    '&:hover': {
                                        background: theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.04)'
                                            : 'rgba(0, 0, 0, 0.02)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ 
                                    minWidth: 0, 
                                    mr: (isCollapsed && isLargeScreen) ? 0 : 2, 
                                    justifyContent: 'center',
                                    color: activePageId === item.id ? 'primary.main' : 'text.secondary',
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                {(!isCollapsed || !isLargeScreen) && (
                                    <ListItemText 
                                        primary={item.text} 
                                        sx={{ 
                                            '& .MuiListItemText-primary': {
                                                fontWeight: activePageId === item.id ? 600 : 500,
                                            }
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Footer Section */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="overline" sx={{ 
                    px: 2, 
                    mb: 2, 
                    display: 'block',
                    color: 'text.secondary',
                    fontWeight: 600,
                    letterSpacing: 1,
                }}>
                    {(!isCollapsed || !isLargeScreen) ? 'SYSTEM' : ''}
                </Typography>
                
                <List sx={{ px: 0 }}>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={RouterLink}
                            to="/app/settings"
                            selected={activePageId === 'settings'}
                            onClick={() => !isLargeScreen && setMobileOpen(false)}
                            sx={{ 
                                borderRadius: 3, 
                                mx: 1,
                                minHeight: 48,
                                '&.Mui-selected': {
                                    background: theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : 'rgba(0, 0, 0, 0.04)',
                                    color: 'primary.main',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ 
                                minWidth: 0, 
                                mr: (isCollapsed && isLargeScreen) ? 0 : 2, 
                                justifyContent: 'center',
                                color: activePageId === 'settings' ? 'primary.main' : 'text.secondary',
                            }}>
                                <Settings size={20} />
                            </ListItemIcon>
                            {(!isCollapsed || !isLargeScreen) && (
                                <ListItemText 
                                    primary="Settings" 
                                    sx={{ 
                                        '& .MuiListItemText-primary': {
                                            fontWeight: activePageId === 'settings' ? 600 : 500,
                                        }
                                    }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                    
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton 
                            onClick={colorMode?.toggleTheme}
                            sx={{ 
                                borderRadius: 3, 
                                mx: 1,
                                minHeight: 48,
                            }}
                        >
                            <ListItemIcon sx={{ 
                                minWidth: 0, 
                                mr: (isCollapsed && isLargeScreen) ? 0 : 2, 
                                justifyContent: 'center',
                                color: 'text.secondary',
                            }}>
                                {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                            </ListItemIcon>
                            {(!isCollapsed || !isLargeScreen) && (
                                <ListItemText 
                                    primary={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
                                    sx={{ 
                                        '& .MuiListItemText-primary': {
                                            fontWeight: 500,
                                        }
                                    }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                    
                    <ListItem disablePadding>
                        <ListItemButton sx={{ 
                            borderRadius: 3, 
                            mx: 1,
                            minHeight: 48,
                        }}>
                            <ListItemIcon sx={{ 
                                minWidth: 0, 
                                mr: (isCollapsed && isLargeScreen) ? 0 : 2, 
                                justifyContent: 'center',
                                color: 'text.secondary',
                            }}>
                                <LogOut size={20} />
                            </ListItemIcon>
                            {(!isCollapsed || !isLargeScreen) && (
                                <ListItemText 
                                    primary="Logout"
                                    sx={{ 
                                        '& .MuiListItemText-primary': {
                                            fontWeight: 500,
                                        }
                                    }}
                                />
                            )}
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
                        <IconButton 
                            onClick={handleNotificationMenu}
                            color="inherit" 
                            sx={{ 
                                mr: 1, 
                                color: theme.palette.text.primary,
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                        >
                            <Badge badgeContent={4} color="error">
                                <Bell size={20} />
                            </Badge>
                        </IconButton>
                        <Menu
                            id="notification-menu"
                            anchorEl={notificationAnchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={notificationOpen}
                            onClose={handleNotificationClose}
                            sx={{
                                '& .MuiPaper-root': {
                                    borderRadius: '12px',
                                    mt: 1,
                                    minWidth: 320,
                                    maxHeight: 400,
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                },
                                '& .MuiMenuItem-root': {
                                    py: 1.5,
                                    px: 2,
                                    borderRadius: 1,
                                    mx: 1,
                                    my: 0.5,
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.08)'
                                            : 'rgba(0, 0, 0, 0.04)',
                                    },
                                },
                            }}
                        >
                            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Notifications
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    4 new notifications
                                </Typography>
                            </Box>
                            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                <MenuItem onClick={handleNotificationClose}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                                        <Box sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: 'error.main',
                                            mt: 1,
                                        }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                Cluster Alert
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Production cluster CPU usage is at 85%
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                2 minutes ago
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                                <MenuItem onClick={handleNotificationClose}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                                        <Box sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: 'warning.main',
                                            mt: 1,
                                        }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                Deployment Success
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Application 'frontend-app' deployed successfully
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                5 minutes ago
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                                <MenuItem onClick={handleNotificationClose}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                                        <Box sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: 'info.main',
                                            mt: 1,
                                        }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                System Update
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                New system update available
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                10 minutes ago
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                                <MenuItem onClick={handleNotificationClose}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                                        <Box sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: 'success.main',
                                            mt: 1,
                                        }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                Backup Complete
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Database backup completed successfully
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                1 hour ago
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                            </Box>
                            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                <MenuItem onClick={handleNotificationClose} sx={{ justifyContent: 'center' }}>
                                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                                        View All Notifications
                                    </Typography>
                                </MenuItem>
                            </Box>
                        </Menu>

                        {/* User Avatar and Dropdown Menu */}
                        <IconButton
                            onClick={handleMenu}
                            color="inherit"
                            sx={{
                                p: 1,
                                ml: 1,
                                display: 'flex',
                                alignItems: 'center',
                                color: theme.palette.text.primary,
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                        >
                            <Avatar 
                                alt="User Avatar" 
                                src="https://i.pravatar.cc/300" 
                                sx={{ 
                                    width: 32, 
                                    height: 32,
                                    border: '2px solid',
                                    borderColor: 'divider',
                                }} 
                            />
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
                                    borderRadius: '12px',
                                    mt: 1,
                                    minWidth: 200,
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                },
                                '& .MuiMenuItem-root': {
                                    py: 1.5,
                                    px: 2,
                                    borderRadius: 1,
                                    mx: 1,
                                    my: 0.5,
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.08)'
                                            : 'rgba(0, 0, 0, 0.04)',
                                    },
                                },
                            }}
                        >
                            <MenuItem onClick={handleClose}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar 
                                        alt="User Avatar" 
                                        src="https://i.pravatar.cc/300" 
                                        sx={{ width: 32, height: 32 }} 
                                    />
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            John Doe
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            john.doe@company.com
                                        </Typography>
                                    </Box>
                                </Box>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Settings size={16} />
                                    <Typography variant="body2">Settings</Typography>
                                </Box>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <LogOut size={16} />
                                    <Typography variant="body2">Logout</Typography>
                                </Box>
                            </MenuItem>
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
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            overflowX: 'hidden',
                            transition: theme.transitions.create("width", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                            borderRadius: 0,
                            bgcolor: 'transparent',
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
