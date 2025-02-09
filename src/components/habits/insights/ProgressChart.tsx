
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  date: string;
  value: number;
}

interface ProgressChartProps {
  habit: HabitDetail;
  progress: HabitProgress[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ habit, progress }) => {
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
    <Card>
      <CardHeader>
        <CardTitle>30-Day Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(date: string) => 
                  new Date(date).toLocaleDateString(undefined, { 
                    day: 'numeric', 
                    month: 'short' 
                  })
                }
                className="text-muted-foreground"
              />
              <YAxis className="text-muted-foreground" />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
