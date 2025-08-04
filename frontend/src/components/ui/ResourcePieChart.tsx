// File: src/components/ui/ResourcePieChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Box, Typography } from '@mui/material';

interface ResourcePieChartProps {
    title: string;
    data: { name: string; value: number; fill: string; }[];
}

const ResourcePieChart: React.FC<ResourcePieChartProps> = ({ title, data }) => {
    return (
        <Box textAlign="center">
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                {title}
            </Typography>
            <ResponsiveContainer width={150} height={150}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        startAngle={-270}
                        endAngle={90}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default ResourcePieChart;
