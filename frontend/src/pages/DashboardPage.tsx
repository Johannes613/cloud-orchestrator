// File: src/pages/DashboardPage.tsx
import {
    Container,
    Paper,
    Typography,
    Box,
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
import ResourcePieChart from '../components/ui/ResourcePieChart.tsx';
import RecentActivityList from '../components/ui/RecentActivityList.tsx';
import { DollarSign, Users, Activity, Cloud } from 'lucide-react';

const salesChartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

const cpuData = [
    { name: 'Used', value: 75, color: '#5E6AD2' },
    { name: 'Available', value: 25, color: '#E0E0E0' },
];

const memoryData = [
    { name: 'Used', value: 60, color: '#F5A623' },
    { name: 'Available', value: 40, color: '#E0E0E0' },
];

const recentActivities = [
    { id: 1, text: "Deployment to production cluster", time: "2 minutes ago" },
    { id: 2, text: "New user 'Jane Doe' registered", time: "1 hour ago" },
    { id: 3, text: "Database migration completed", time: "3 hours ago" },
    { id: 4, text: "Security patch applied to API-Gateway", time: "1 day ago" },
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
                <div className="col-12 col-lg-6">
                    <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" mb={2}>Sales Over Time</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#5E6AD2" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </div>
                <div className="col-12 col-lg-6">
                    <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" mb={2}>Resource Usage</Typography>
                        <Box display="flex" justifyContent="space-around" alignItems="center" height={300}>
                            <ResourcePieChart title="CPU" data={cpuData} />
                            <ResourcePieChart title="Memory" data={memoryData} />
                        </Box>
                    </Paper>
                </div>
            </div>

            <Box mt={4}>
                <RecentActivityList activities={recentActivities} />
            </Box>
        </Container>
    );
};

export default DashboardPage;
