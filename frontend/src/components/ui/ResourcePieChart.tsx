// File: src/components/ui/ResourcePieChart.tsx
import { Box, Typography } from '@mui/material';

interface ResourcePieChartProps {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
    title: string;
}

const ResourcePieChart: React.FC<ResourcePieChartProps> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    const renderPieSlice = (item: any, index: number) => {
        const percentage = (item.value / total) * 100;
        const startAngle = data
            .slice(0, index)
            .reduce((sum, d) => sum + (d.value / total) * 360, 0);
        
        return (
            <circle
                key={item.name}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={item.color}
                strokeWidth="20"
                strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
                strokeDashoffset={-startAngle * 1.4}
                transform="rotate(-90 50 50)"
            />
        );
    };

    return (
        <Box textAlign="center">
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Box display="flex" justifyContent="center" mb={2}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                    {data.map((item, index) => renderPieSlice(item, index))}
                </svg>
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
                {data.map((item) => (
                    <Box key={item.name} display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box 
                                width={12} 
                                height={12} 
                                borderRadius="50%" 
                                bgcolor={item.color} 
                            />
                            <Typography variant="body2">{item.name}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                            {((item.value / total) * 100).toFixed(1)}%
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ResourcePieChart;
