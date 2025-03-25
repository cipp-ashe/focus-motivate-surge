
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';

interface MetricsChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  dataKey?: string;
  xAxisDataKey?: string;
  height?: number;
  className?: string;
  barColor?: string;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  data,
  dataKey = 'value',
  xAxisDataKey = 'name',
  height = 200,
  className,
  barColor = 'var(--primary)',
}) => {
  return (
    <div className={cn("w-full rounded-lg border border-border/40 p-4 bg-background/50 dark:bg-gray-800/50", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted-foreground/20" />
          <XAxis 
            dataKey={xAxisDataKey} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: 'var(--muted-foreground)', opacity: 0.2 }}
            className="text-xs text-muted-foreground dark:text-gray-400" 
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'var(--muted-foreground)', opacity: 0.2 }}
            className="text-xs text-muted-foreground dark:text-gray-400" 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)', 
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              borderRadius: '0.375rem',
              fontSize: '0.75rem'
            }} 
          />
          <Bar 
            dataKey={dataKey} 
            fill={barColor} 
            radius={[4, 4, 0, 0]} 
            className="dark:opacity-80" 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
