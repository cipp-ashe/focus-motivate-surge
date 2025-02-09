import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Stack,
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
import { HabitDetail, HabitProgress } from './types';

interface ChartDataPoint {
  date: string;
  value: number;
}

interface HabitInsightsProps {
  habit: HabitDetail;
  progress: HabitProgress[];
}

const HabitInsights: React.FC<HabitInsightsProps> = ({ habit, progress }) => {
  const theme = useTheme();

  const getCompletionRate = (): number => {
    const totalDays = progress.length;
    if (totalDays === 0) return 0;

    const completedDays = progress.filter(p => 
      typeof p.value === 'boolean' ? p.value : p.value > 0
    ).length;

    return (completedDays / totalDays) * 100;
  };

  const getBestStreak = (): number => {
    let currentStreak = 0;
    let bestStreak = 0;
    let lastDate: Date | null = null;

    progress
      .filter(p => typeof p.value === 'boolean' ? p.value : p.value > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(p => {
        const currentDate = new Date(p.date);
        
        if (!lastDate || 
            (lastDate.getTime() + 24 * 60 * 60 * 1000) === currentDate.getTime()) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }

        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }

        lastDate = currentDate;
      });

    return bestStreak;
  };

  const getPreferredTime = (): string => {
    const timeDistribution = progress.reduce((acc, p) => {
      const hour = new Date(p.date).getHours();
      if (typeof p.value === 'boolean' ? p.value : p.value > 0) {
        if (hour < 12) acc.morning++;
        else if (hour < 17) acc.afternoon++;
        else acc.evening++;
      }
      return acc;
    }, { morning: 0, afternoon: 0, evening: 0 });

    const max = Math.max(
      timeDistribution.morning,
      timeDistribution.afternoon,
      timeDistribution.evening
    );

    if (max === 0) return 'No data yet';
    if (max === timeDistribution.morning) return 'Morning';
    if (max === timeDistribution.afternoon) return 'Afternoon';
    return 'Evening';
  };

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
    <Box>
      <Grid container spacing={3}>
        {/* Completion Rate */}
        <Grid item xs={12} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completion Rate
              </Typography>
              <Box sx={{ position: 'relative', pt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={getCompletionRate()}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: theme.palette.grey[200],
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                    },
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {Math.round(getCompletionRate())}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Best Streak */}
        <Grid item xs={12} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Best Streak
              </Typography>
              <Typography variant="h4" color="primary">
                {getBestStreak()} days
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep building your momentum!
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferred Time */}
        <Grid item xs={12} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Successful Time
              </Typography>
              <Typography variant="h4" color="primary">
                {getPreferredTime()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You perform best during this time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Chart */}
        <Grid item xs={12}>
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
        </Grid>

        {/* Insights */}
        <Grid item xs={12}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Insights & Tips
              </Typography>
              <Stack spacing={2}>
                {habit.insights.map((insight, index) => (
                  <Box key={index}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      {insight.type === 'streak' ? '🔥' :
                       insight.type === 'completion' ? '✅' :
                       insight.type === 'timing' ? '⏰' : '🔄'} {insight.description}
                    </Typography>
                  </Box>
                ))}
                {habit.tips.map((tip, index) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    💡 {tip}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HabitInsights;
