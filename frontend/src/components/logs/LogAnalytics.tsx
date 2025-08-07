import React from 'react';
import { Typography } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface LogAnalyticsProps {
    logs: any[];
}

const LogAnalytics: React.FC<LogAnalyticsProps> = ({ logs }) => {




    const hourlyData = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date();
        hour.setHours(hour.getHours() - (23 - i));
        const hourStr = hour.toLocaleTimeString('en-US', {
            hour: '2-digit',
            hour12: false,
        });

        const count = logs.filter((log) => {
            const logTime = new Date(log.timestamp);
            return (
                logTime.getHours() === hour.getHours() &&
                logTime.getDate() === hour.getDate()
            );
        }).length;

        return { hour: hourStr, count };
    });



    return (
        <div className="container mt-4">
            <div className="row">
                {/* Pie Chart */}
                <div className="col-md-6 mb-4">
                    <div className="p-4 shadow rounded bg-white" style={{ height: '400px' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
                            Log Level Distribution
                        </Typography>
                        {/* <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer> */}
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="col-md-6 mb-4">
                    <div className="p-4 shadow rounded bg-white" style={{ height: '400px' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
                            Log Activity (Last 24 Hours)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="black" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogAnalytics;
