// File: src/pages/DashboardPage.tsx
import {
    Container,
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import StatCard from '../components/ui/StatCard.tsx';
import { DollarSign, Users, Activity, Cloud } from 'lucide-react';

const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

const DashboardPage = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Page Header */}
            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome to your professional dashboard overview.
                </Typography>
            </Box>

            {/* Stats Cards Grid */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-md-3">
                    <StatCard title="Total Sales" value="$24,895" icon={<DollarSign size={24} />} />
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                    <StatCard title="New Users" value="1,245" icon={<Users size={24} />} />
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                    <StatCard title="Active Services" value="12" icon={<Cloud size={24} />} />
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                    <StatCard title="Uptime" value="99.9%" icon={<Activity size={24} />} />
                </div>
            </div>

            {/* Charts and Recent Activity */}
            <div className="row g-3">
                <div className="col-12 col-md-8">
                    <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" mb={2}>Sales Over Time</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#5E6AD2" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </div>
                <div className="col-12 col-md-4">
                    <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" mb={2}>Recent Activities</Typography>
                        <List disablePadding>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="Deployment to production cluster"
                                    secondary="2 minutes ago"
                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="New user 'Jane Doe' registered"
                                    secondary="1 hour ago"
                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="Database migration completed"
                                    secondary="3 hours ago"
                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="Security patch applied to API-Gateway"
                                    secondary="1 day ago"
                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </div>
            </div>
        </Container>
    );
};

export default DashboardPage;
