import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Avatar,
  Chip,
  Stack,
  Paper,
  TextField,
} from '@mui/material';
import { Row, Col, Button as BootstrapButton } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import SignInModal from '../components/auth/SignInModal';
import { useAuth } from '../contexts/AuthContext';
import {
  Cloud,
  Timeline,
  SpaceDashboard,
  Speed,
  CheckCircleOutline,
  ArrowForwardOutlined,
  PlayArrow,
  EmailOutlined,
  PersonOutline,
} from '@mui/icons-material';
import heroImg from "../assets/hero.jpg";
import dashImg from "../assets/dash.png";


// --- Header Component ---
const LandingHeader: React.FC<{ onSignInClick: () => void }> = ({ onSignInClick }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleSignInClick = () => {
    setMobileOpen(false);
    onSignInClick();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { text: 'Features', action: () => handleNavClick('features-section') },
    { text: 'Demo', action: () => handleNavClick('demo-section') },
    { text: 'Team', action: () => handleNavClick('team-section') },
  ];

  return (
    <>
      <Box sx={{ 
        py: 2, 
        px: { xs: 2, md: 4 }, 
        bgcolor: 'transparent', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        position: 'absolute', 
        width: '100%', 
        zIndex: 10 
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#ffffff' }}>
          Orchestrator
        </Typography>
        
        {/* Desktop Navigation */}
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center'
          }}
        >
          {navItems.map((item) => (
            <BootstrapButton 
              key={item.text}
              variant="outline-light" 
              size="sm"
              onClick={item.action}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              {item.text}
            </BootstrapButton>
          ))}
          <BootstrapButton 
            variant={currentUser ? "outline-light" : "light"}
            size="sm"
            onClick={currentUser ? handleLogout : handleSignInClick}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              backgroundColor: currentUser ? 'transparent' : '#ffffff',
              color: currentUser ? '#ffffff' : '#000000',
              borderColor: currentUser ? 'rgba(255,255,255,0.3)' : '#ffffff',
            }}
          >
            {currentUser ? 'Logout' : 'Sign In'}
          </BootstrapButton>
          <Link to="/app" style={{ textDecoration: 'none' }}>
            <BootstrapButton 
              variant="light" 
              size="sm"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              Dashboard
            </BootstrapButton>
          </Link>
        </Stack>

        {/* Mobile Menu Button */}
        <BootstrapButton
          variant="outline-light"
          size="sm"
          onClick={handleDrawerToggle}
          style={{
            fontSize: '14px',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            display: 'block',
          }}
          className="d-lg-none"
        >
          ☰
        </BootstrapButton>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 20,
          display: mobileOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
          <BootstrapButton
            variant="outline-light"
            size="sm"
            onClick={handleDrawerToggle}
            style={{
              fontSize: '18px',
              fontWeight: 500,
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            ✕
          </BootstrapButton>
        </Box>
        
        <Stack spacing={3} sx={{ textAlign: 'center' }}>
          {navItems.map((item) => (
            <BootstrapButton 
              key={item.text}
              variant="outline-light" 
              size="lg"
              onClick={item.action}
              style={{
                fontSize: '18px',
                fontWeight: 500,
                padding: '12px 24px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                minWidth: '200px',
              }}
            >
              {item.text}
            </BootstrapButton>
          ))}
          <BootstrapButton 
            variant={currentUser ? "outline-light" : "light"}
            size="lg"
            onClick={currentUser ? handleLogout : handleSignInClick}
            style={{
              fontSize: '18px',
              fontWeight: 500,
              padding: '12px 24px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              minWidth: '200px',
              backgroundColor: currentUser ? 'transparent' : '#ffffff',
              color: currentUser ? '#ffffff' : '#000000',
              borderColor: currentUser ? 'rgba(255,255,255,0.3)' : '#ffffff',
            }}
          >
            {currentUser ? 'Logout' : 'Sign In'}
          </BootstrapButton>
          <Link to="/app" style={{ textDecoration: 'none' }}>
            <BootstrapButton 
              variant="light" 
              size="lg"
              style={{
                fontSize: '18px',
                fontWeight: 500,
                padding: '12px 24px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                minWidth: '200px',
              }}
            >
              Dashboard
            </BootstrapButton>
          </Link>
        </Stack>
      </Box>
    </>
  );
};


const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const { currentUser } = useAuth();

  const handleDashboardClick = () => {
    navigate('/app');
  };

  const handleSignInClick = () => {
    setSignInModalOpen(true);
  };

  const handleSignInModalClose = () => {
    setSignInModalOpen(false);
  };

  // Consistent styles for cards
  const cardBorderColor = 'rgba(94, 106, 210, 0.5)'; // A subtle blue for the border
  const cardBgColor = '#1a1a1a'; // Dark blackish background

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Lead Cloud Architect',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      expertise: ['Kubernetes', 'AWS', 'DevOps'],
    },
    {
      name: 'Michael Chen',
      role: 'Senior DevOps Engineer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      expertise: ['Docker', 'CI/CD', 'Monitoring'],
    },
    {
      name: 'Emily Rodriguez',
      role: 'Platform Engineer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      expertise: ['GitOps', 'Security', 'Automation'],
    },
  ];

  const stats = [
    {
      icon: <Speed sx={{ fontSize: 40, color: '#ffffff' }} />,
      value: '99.9%',
      label: 'Uptime',
    },
    {
      icon: <Cloud sx={{ fontSize: 40, color: '#ffffff' }} />,
      value: '500+',
      label: 'Deployments',
    },
    {
      icon: <CheckCircleOutline sx={{ fontSize: 40, color: '#ffffff' }} />,
      value: '50+',
      label: 'Clients',
    },
    {
      icon: <Timeline sx={{ fontSize: 40, color: '#ffffff' }} />,
      value: '24/7',
      label: 'Support',
    },
  ];

  const mainFeature = {
    icon: <SpaceDashboard sx={{ fontSize: 40, color: '#ffffff' }} />,
    title: 'Intuitive Dashboard & Monitoring',
    description: 'Gain complete visibility and control over your applications with a centralized dashboard and real-time monitoring capabilities.',
    bulletPoints: [
      'Real-time application health and performance metrics',
      'Customizable dashboards for tailored insights',
      'Automated alerts and notifications for critical events',
      'Comprehensive logging and tracing for debugging',
    ],
    gradient: 'linear-gradient(135deg, #5E6AD2 0%, #764ba2 100%)', // Blue/purple gradient for the icon background
  };

  return (
    <Box sx={{ bgcolor: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      <LandingHeader onSignInClick={handleSignInClick} />

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#000000',
          color: '#ffffff',
          py: { xs: 6, sm: 8, md: 12 },
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1,
          },
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <Row className="justify-content-center text-center">
            <Col xs={12} md={10} lg={8}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem', lg: '3.5rem' },
                  mb: { xs: 2, md: 3 },
                  color: '#ffffff',
                  lineHeight: 1.1,
                }}
              >
                Cloud Native App
                <br />
                <Box component="span" sx={{ background: 'linear-gradient(45deg, #ffffff, #cccccc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Orchestrator
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 4, md: 6 },
                  opacity: 0.7,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  lineHeight: 1.6,
                  px: { xs: 2, sm: 0 },
                }}
              >
                Advanced platform for managing, deploying, and monitoring cloud-native applications
                across multiple environments with enterprise-grade security and GitOps workflows.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 2 }}
                justifyContent="center"
                alignItems="center"
                sx={{ gap: { xs: 2, sm: 2 } }}
              >
                <BootstrapButton
                  onClick={handleDashboardClick}
                  variant="light"
                  size="sm"
                  className="d-flex align-items-center"
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '12px 24px',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {currentUser ? 'Go to Dashboard' : 'Launch Dashboard'} <ArrowForwardOutlined sx={{ ml: 1, fontSize: '1.1rem' }} />
                </BootstrapButton>
                <BootstrapButton
                  onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline-light"
                  size="sm"
                  className="d-flex align-items-center"
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '12px 24px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <PlayArrow sx={{ mr: 1, fontSize: '1.1rem' }} /> Watch Demo
                </BootstrapButton>
              </Stack>
            </Col>
          </Row>
        </div>
      </Box>

      {/* Stats Section */}
      <div className="py-5" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <Row className="justify-content-center g-4">
          {stats.map((stat, index) => (
            <Col xs={6} sm={4} md={3} key={index}>
              <Box
                sx={{
                  background: cardBorderColor, // Solid blue border color
                  p: '1px', // Border thickness
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 0px rgba(94, 106, 210, 0.0)', // Initial subtle shadow
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 0 15px rgba(94, 106, 210, 0.5)', // Blue glow on hover
                  },
                }}
              >
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    bgcolor: cardBgColor, // Consistent blackish background
                    borderRadius: 'inherit',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Box sx={{ color: '#ffffff', mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Card>
              </Box>
            </Col>
          ))}
        </Row>
      </div>

      {/* Powerful Features Section (Redesigned) */}
      <div className="py-5" id="features-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#ffffff' }}>
            Powerful Features
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, lineHeight: 1.6, fontSize: '1rem' }}>
            Everything you need to orchestrate your cloud-native applications
          </Typography>
        </Box>
        <Row className="justify-content-center align-items-center g-5">
          <Col xs={12} lg={6}>
            <Box
              sx={{
                background: cardBorderColor, // Blue border
                p: '1px',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                boxShadow: '0 0 0px rgba(94, 106, 210, 0.0)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 0 25px rgba(94, 106, 210, 0.5)', // Blue glow on hover
                },
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  p: 4,
                  bgcolor: cardBgColor, // Blackish background
                  borderRadius: 'inherit',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  className="feature-icon"
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 3,
                    background: mainFeature.gradient, // Specific gradient for this icon
                    display: 'inline-flex',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {mainFeature.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#ffffff' }}>
                  {mainFeature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, mb: 3 }}>
                  {mainFeature.description}
                </Typography>
                <Stack spacing={1}>
                  {mainFeature.bulletPoints.map((point, pointIndex) => (
                    <Box key={pointIndex} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <CheckCircleOutline sx={{ color: '#5E6AD2', fontSize: 20, mt: 0.2 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                        {point}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Box>
          </Col>
          <Col xs={12} md={6} className="d-flex justify-content-center">
            <Box
              sx={{
                height: 400,
                width: '100%',
                maxWidth: 600,
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: 3, // Increased border radius for consistency
                border: `1px solid ${cardBorderColor}`, // Consistent border
                boxShadow: '0 0 15px rgba(94, 106, 210, 0.3)', // Subtle glow
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 0 25px rgba(94, 106, 210, 0.5)', // Enhanced glow on hover
                },
              }}
            >
              <img
                src={dashImg}
                alt="Innovation"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  borderRadius: 'inherit',
                }}
              />
            </Box>
          </Col>
        </Row>
      </div>

      {/* Innovation Section */}
      <Box sx={{ py: 8, bgcolor: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <Row className="align-items-center g-5">
            <Col xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, color: '#ffffff' }}>
                Innovation at Scale
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.8, fontWeight: 400, lineHeight: 1.6, fontSize: '1rem' }}>
                Built for modern cloud-native applications with enterprise-grade features and
                seamless integration with your existing infrastructure.
              </Typography>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleOutline sx={{ color: '#ffffff', fontSize: 24 }} />
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                    Zero-downtime deployments with advanced rollback strategies
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleOutline sx={{ color: '#ffffff', fontSize: 24 }} />
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                    Real-time monitoring and alerting across all environments
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleOutline sx={{ color: '#ffffff', fontSize: 24 }} />
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                    GitOps workflow integration with automated CI/CD pipelines
                  </Typography>
                </Box>
              </Stack>
            </Col>
            <Col xs={12} lg={6} className="d-flex justify-content-center">
              <Box
                sx={{
                  height: 400,
                  width: '100%',
                  maxWidth: 600,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderRadius: 3,
                  border: `1px solid ${cardBorderColor}`,
                  boxShadow: '0 0 15px rgba(94, 106, 210, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 0 25px rgba(94, 106, 210, 0.5)',
                  },
                }}
              >
                <img
                  src={heroImg}
                  alt="Innovation"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 'inherit',
                  }}
                />
              </Box>
            </Col>
          </Row>
        </div>
      </Box>

      {/* Demo Section */}
      <Box id="demo-section" sx={{ py: 8, bgcolor: '#000000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#ffffff' }}>
              Watch a Demo
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, lineHeight: 1.6, fontSize: '1rem' }}>
              See our platform in action and discover how it can transform your operations.
            </Typography>
          </Box>
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%', // 16:9 Aspect Ratio
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                  bgcolor: 'black', // Fallback background for video
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/fp9_ubiKqFU?si=cOt2qAtgVplc7iyX" // Replace with actual demo video URL
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0 }}
                ></iframe>
              </Box>
            </Col>
          </Row>
        </div>
      </Box>

      {/* Team Section */}
      <div className="py-5" id="team-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#ffffff' }}>
            Meet Our Team
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, lineHeight: 1.6, fontSize: '1rem' }}>
            Experts in cloud-native technologies and DevOps practices
          </Typography>
        </Box>
        <Row className="justify-content-center g-4">
          {teamMembers.map((member, index) => (
            <Col xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  background: cardBorderColor,
                  p: '1px',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 0px rgba(94, 106, 210, 0.0)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 0 15px rgba(94, 106, 210, 0.5)',
                  },
                }}
              >
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    bgcolor: cardBgColor,
                    borderRadius: 'inherit',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    height: '100%',
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      border: '3px solid rgba(255,255,255,0.2)',
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                    {member.role}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                    {member.expertise.map((skill, skillIndex) => (
                      <Chip
                        key={skillIndex}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: 'rgba(255,255,255,0.3)',
                          color: '#ffffff',
                          '&:hover': {
                            borderColor: '#ffffff',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Card>
              </Box>
            </Col>
          ))}
        </Row>
      </div>

      {/* Contact Us Section */}
      <Box sx={{ py: 8, bgcolor: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#ffffff' }}>
              Contact Us
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, lineHeight: 1.6, fontSize: '1rem' }}>
              Have questions or want to learn more? Reach out to our team.
            </Typography>
          </Box>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 5 },
              bgcolor: cardBgColor,
              border: `1px solid ${cardBorderColor}`,
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <PersonOutline sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                  ),
                }}
                // FIX APPLIED HERE
                sx={(theme) => ({
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                    color: '#ffffff',
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                })}
              />
              <TextField
                fullWidth
                label="Your Email"
                type="email"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <EmailOutlined sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                  ),
                }}
                // FIX APPLIED HERE
                sx={(theme) => ({
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                    color: '#ffffff',
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                })}
              />
              <TextField
                fullWidth
                label="Your Message"
                multiline
                rows={4}
                variant="outlined"
                // FIX APPLIED HERE
                sx={(theme) => ({
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                    color: '#ffffff',
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                })}
              />
              <BootstrapButton
                variant="light"
                size="lg"
                className="w-100"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '12px 24px',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  marginTop: '24px',
                }}
              >
                Send Message
              </BootstrapButton>
            </Stack>
          </Paper>
        </div>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: '#000000',
          color: '#ffffff',
          py: 12,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, color: '#ffffff' }}>
              Get Started Today
            </Typography>
            <Typography variant="h6" sx={{ mb: 6, opacity: 0.8, fontWeight: 400, lineHeight: 1.6, fontSize: '1rem' }}>
              Experience the future of cloud-native orchestration with intelligent deployment
              and monitoring for your applications.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <BootstrapButton
                onClick={handleDashboardClick}
                variant="light"
                size="lg"
                className="d-flex align-items-center"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '12px 24px',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                }}
              >
                {currentUser ? 'Go to Dashboard' : 'Launch Dashboard'} <ArrowForwardOutlined sx={{ ml: 1, fontSize: '1.1rem' }} />
              </BootstrapButton>
              <BootstrapButton
                onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline-light"
                size="lg"
                className="d-flex align-items-center"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '12px 24px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <PlayArrow sx={{ mr: 1, fontSize: '1.1rem' }} /> Watch Demo
              </BootstrapButton>
            </Stack>
          </Box>
        </div>
      </Box>

      {/* Footer */}
      <Box sx={{
        bgcolor: '#000000',
        py: 6,
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <Typography variant="body2" align="center" sx={{ fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
            © 2025 Cloud Native App Orchestrator. Built for modern cloud-native applications.
          </Typography>
        </div>
      </Box>

      {/* Sign In Modal */}
      <SignInModal 
        open={signInModalOpen} 
        onClose={handleSignInModalClose} 
      />
    </Box>
  );
};

export default LandingPage;