import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const LandingHeader: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDashboardClick = () => {
    navigate('/app');
    setMobileOpen(false);
  };

  // Updated navItems with correct hrefs pointing to section IDs
  const navItems = [
    { text: 'Features', href: '#features' },
    { text: 'Demo', href: '#demo' }, // Added Demo section link
    { text: 'Team', href: '#team' },
    { text: 'Contact', href: '#contact' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', bgcolor: theme.palette.background.default, height: '100%' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700, color: '#ffffff' }}>
        Orchestrator
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Button
              component="a" // Use 'a' tag for anchor links
              href={item.href}
              sx={{
                width: '100%',
                textAlign: 'center',
                color: '#ffffff',
                fontWeight: 500,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.text}
            </Button>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <Button
            onClick={handleDashboardClick}
            variant="contained"
            sx={{
              bgcolor: '#ffffff',
              color: '#000000',
              mx: 2,
              mt: 2,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#f5f5f5',
              },
            }}
          >
            Launch Dashboard
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'transparent', // Transparent background for a sleek look
          border: 'none',
          boxShadow: 'none', // Remove shadow
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1,
          }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '1.8rem',
                '&:hover': {
                  color: '#ffffff',
                },
              }}
            >
              Orchestrator
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component="a" // Use 'a' tag for anchor links
                    href={item.href}
                    sx={{
                      color: '#ffffff',
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                <Button
                  onClick={handleDashboardClick}
                  variant="contained"
                  sx={{
                    bgcolor: '#ffffff',
                    color: '#000000',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 3, // Adjusted padding
                    py: 1, // Adjusted padding
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                    },
                  }}
                >
                  Launch Dashboard
                </Button>
              </Box>
            )}

            {/* Mobile Navigation */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ color: '#ffffff' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <nav>
        <Drawer
          anchor="right"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, bgcolor: theme.palette.background.default },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
};

export default LandingHeader;
