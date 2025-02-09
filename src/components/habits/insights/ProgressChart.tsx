
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { HabitDetail, HabitProgress } from '../types';

interface ChartDataPoint {
  date: string;
  value: number;
}

interface ProgressChartProps {
  habit: HabitDetail;
  progress: HabitProgress[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ habit, progress }) => {
  const theme = useTheme();

  const getChartData = (): ChartDataPoint[] => {
    const last30Days = [...Array(30)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last30Days.map(date => {
      const dayProgress = progress.find(p => p.date === date);
      return {
        date,
        value: dayProgress ? (typeof dayProgress.value === 'boolean' ? (dayProgress.value ? 1 : 0) : dayProgress.value) : 0,
      };
    });
  };

  const formatTooltipValue = (value: number): [string | number, string] => [
    habit.metrics.type === 'boolean'
      ? value === 1 ? 'Completed' : 'Not Completed'
      : `${value} ${habit.metrics.unit || ''}`,
    'Progress'
  ];

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          30-Day Progress
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date: string) => 
                  new Date(date).toLocaleDateString(undefined, { 
                    day: 'numeric', 
                    month: 'short' 
                  })
                }
              />
              <YAxis />
              <Tooltip
                formatter={formatTooltipValue}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
