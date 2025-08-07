import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  AlertTitle,
  Button,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  People,
  Speed,
  Cloud,
  CheckCircle,
  Warning,
  Schedule,
} from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container as BootstrapContainer, Row as BootstrapRow, Col as BootstrapCol } from 'react-bootstrap';
import DashboardHeader from '../components/dashboard/DashboardHeader'; 
import StatCard from '../components/dashboard/StatCard';
import { firebaseService } from '../services/firebaseService';
import { seedInitialData } from '../utils/seedData';
import { useAuth } from '../contexts/AuthContext';
import { mockDashboardStats } from '../utils/mockData';
import { showSignInPrompt } from '../utils/toast'; 

const DashboardPage = () => {
    const { currentUser } = useAuth();
    const [dashboardStats, setDashboardStats] = useState({
        totalApplications: 0,
        runningApplications: 0,
        failedApplications: 0,
        totalReplicas: 0,
        averageCpuUsage: 0,
        averageMemoryUsage: 0,
    });
    // const [loading, setLoading] = useState(false);


    useEffect(() => {
        const loadDashboardStats = async () => {
            if (!currentUser) {
                // Show mock data for non-logged-in users
                setDashboardStats(mockDashboardStats);
                // setLoading(false);
                return;
            }
            try {
                const stats = await firebaseService.getDashboardStats(currentUser.uid);
                setDashboardStats(stats);
            } catch (error) {
                console.error('Error loading dashboard stats:', error);
            } finally {
                // setLoading(false);
            }
        };

        loadDashboardStats();
    }, [currentUser]);

    const handleSeedData = async () => {
        if (!currentUser) {
            // Show sign-in prompt for non-logged-in users
            showSignInPrompt();
            return;
        }
        try {
            await seedInitialData(currentUser.uid);
            // Reload stats after seeding
            const stats = await firebaseService.getDashboardStats(currentUser.uid);
            setDashboardStats(stats);
        } catch (error) {
            console.error('Error seeding data:', error);
        }
    };

    // Mock data for charts (you can replace with real data from Firebase)
    const salesData = [
        { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 5000 }, { name: 'Apr', value: 2780 },
        { name: 'May', value: 4890 }, { name: 'Jun', value: 6390 },
        { name: 'Jul', value: 7490 },
    ];

    const performanceData = [
        { name: 'CPU', value: 75, color: '#5E6AD2' },
        { name: 'Memory', value: 60, color: '#F5A623' },
        { name: 'Storage', value: 45, color: '#7ED321' },
        { name: 'Network', value: 85, color: '#FF6B6B' },
    ];

    const resourceUsageData = [
        { name: 'Used', value: 75, color: '#5E6AD2' },
        { name: 'Available', value: 25, color: '#E0E0E0' },
    ];

    const memoryUsageData = [
        { name: 'Used', value: 60, color: '#F5A623' },
        { name: 'Available', value: 40, color: '#E0E0E0' },
    ];

    const recentActivities = [
        { id: 1, text: "Deployment to production cluster", time: "2 minutes ago", type: "deployment", status: "success" },
        { id: 2, text: "New user 'Jane Doe' registered", time: "1 hour ago", type: "user", status: "info" },
        { id: 3, text: "Database migration completed", time: "3 hours ago", type: "database", status: "success" },
        { id: 4, text: "Security patch applied to API-Gateway", time: "1 day ago", type: "security", status: "warning" },
    ];

    const alerts = [
        { id: 1, message: "High CPU usage", severity: "warning", time: "5 min ago", status: "warning" },
        { id: 2, message: "DB connection OK", severity: "success", time: "10 min ago", status: "success" },
        { id: 3, message: "New security update", severity: "info", time: "1 hour ago", status: "info" },
    ];

    const systemStatusData = [
        { name: "API Gateway", status: "online", uptime: "99.9%", responseTime: 45 },
        { name: "Database Cluster", status: "online", uptime: "99.8%", responseTime: 120 },
        { name: "Load Balancer", status: "warning", uptime: "99.5%", responseTime: 280 },
        { name: "Cache Server", status: "online", uptime: "99.9%", responseTime: 15 },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success': return <CheckCircle sx={{ color: 'success.main' }} />;
            case 'warning': return <Warning sx={{ color: 'warning.main' }} />;
            case 'info': return <Schedule sx={{ color: 'info.main' }} />;
            default: return <Speed sx={{ color: 'grey.500' }} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'success.main';
            case 'warning': return 'warning.main';
            case 'offline': return 'error.main';
            default: return 'grey.500';
        }
    };

    return (
        <BootstrapContainer fluid className="mt-2 mb-4 ">
            <DashboardHeader />
            
            {/* Demo Notification for Non-logged-in Users */}
            {!currentUser && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    <AlertTitle>Demo Mode</AlertTitle>
                    You're viewing demonstration data. Sign in to access your personal dashboard and manage your applications.
                </Alert>
            )}
            
            {/* Seed Data Button for Testing */}
            <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Button 
                    variant="outlined" 
                    onClick={handleSeedData}
                    sx={{ 
                        borderColor: '#5E6AD2', 
                        color: '#5E6AD2',
                        '&:hover': { 
                            borderColor: '#4a5bc0', 
                            backgroundColor: 'rgba(94, 106, 210, 0.1)' 
                        }
                    }}
                >
                    {currentUser ? 'Seed Test Data' : 'Try Interactive Features'}
                </Button>
            </Box>

            {/* Stats Cards */}
            <BootstrapRow className="g-4 mb-4">
                <BootstrapCol xs={12} sm={6} lg={3}>
                    <StatCard title="Total Applications" value={dashboardStats.totalApplications.toString()} Icon={Cloud} color="primary" />
                </BootstrapCol>
                <BootstrapCol xs={12} sm={6} lg={3}>
                    <StatCard title="Running Applications" value={dashboardStats.runningApplications.toString()} Icon={People} color="success" />
                </BootstrapCol>
                <BootstrapCol xs={12} sm={6} lg={3}>
                    <StatCard title="Failed Applications" value={dashboardStats.failedApplications.toString()} Icon={Warning} color="error" />
                </BootstrapCol>
                <BootstrapCol xs={12} sm={6} lg={3}>
                    <StatCard title="Total Replicas" value={dashboardStats.totalReplicas.toString()} Icon={Speed} color="warning" />
                </BootstrapCol>
            </BootstrapRow>

            {/* Charts Section */}
            <BootstrapRow className="g-4 mb-4">
                <BootstrapCol xs={12} lg={7}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Revenue Overview</Typography>
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#5E6AD2" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#5E6AD2" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                    <Area type="monotone" dataKey="value" stroke="#5E6AD2" strokeWidth={2} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </BootstrapCol>
                <BootstrapCol xs={12} lg={5}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Resource Usage</Typography>
                             <BootstrapRow className="g-4 align-items-center">
                                <BootstrapCol xs={12} sm={6} className="text-center">
                                    <ResponsiveContainer width="100%" height={150}>
                                        <PieChart>
                                            <Pie data={resourceUsageData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                                {resourceUsageData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Typography variant="body2" color="text.secondary">CPU Usage</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>75%</Typography>
                                </BootstrapCol>
                                <BootstrapCol xs={12} sm={6} className="text-center">
                                    <ResponsiveContainer width="100%" height={150}>
                                        <PieChart>
                                            <Pie data={memoryUsageData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                                {memoryUsageData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Typography variant="body2" color="text.secondary">Memory Usage</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>60%</Typography>
                                </BootstrapCol>
                            </BootstrapRow>
                        </CardContent>
                    </Card>
                </BootstrapCol>
            </BootstrapRow>

            {/* First Row of the 2x2 Grid */}
            <BootstrapRow className="g-4 mb-4">
                <BootstrapCol xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Performance Metrics</Typography>
                            <Box>
                                {performanceData.map((item, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="body2">{item.name}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.value}%</Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={item.value} sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: item.color } }}/>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </BootstrapCol>
                <BootstrapCol xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>System Status</Typography>
                            <List>
                                {systemStatusData.map((system, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem disablePadding>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: getStatusColor(system.status), width: 10, height: 10, mr: 1 }} />
                                            </ListItemAvatar>
                                            <ListItemText primary={system.name} secondary={`Uptime: ${system.uptime}`} />
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: system.responseTime < 100 ? 'success.main' : system.responseTime < 300 ? 'warning.main' : 'error.main' }}>
                                                {system.responseTime}ms
                                            </Typography>
                                        </ListItem>
                                        {index < systemStatusData.length - 1 && <Divider sx={{ my: 1.5 }} />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </BootstrapCol>
            </BootstrapRow>

            {/* Second Row of the 2x2 Grid */}
            <BootstrapRow className="g-4">
                <BootstrapCol xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Recent Activity</Typography>
                            <List>
                                {recentActivities.map((activity, index) => (
                                    <React.Fragment key={activity.id}>
                                        <ListItem disablePadding>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'background.default' }}>{getStatusIcon(activity.status)}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={activity.text} secondary={activity.time} />
                                            <Chip label={activity.type} size="small" variant="outlined" />
                                        </ListItem>
                                        {index < recentActivities.length - 1 && <Divider sx={{ my: 1.5 }} variant="inset" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </BootstrapCol>
                <BootstrapCol xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>System Alerts</Typography>
                            <Box>
                                {alerts.map((alert) => (
                                    <Alert key={alert.id} severity={alert.severity as any} icon={getStatusIcon(alert.status)} sx={{ mb: 2, alignItems: 'center' }}>
                                        <AlertTitle sx={{mb: 0, fontWeight: 'bold'}}>{alert.message}</AlertTitle>
                                        {alert.time}
                                    </Alert>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </BootstrapCol>
            </BootstrapRow>

        </BootstrapContainer>
    );
};

export default DashboardPage;