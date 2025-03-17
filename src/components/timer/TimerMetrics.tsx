import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { secondsToMinutes } from '@/utils/formatters';
import { TimerMetricsProps } from './types';
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useEvent } from '@/hooks/useEvent'; 

export function TimerMetrics({ metrics, showExtended = false }: TimerMetricsProps) {
  // Only render if we have metrics
  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Timer Metrics</CardTitle>
          <CardDescription>No metrics available yet</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <ExclamationCircleIcon className="mx-auto h-12 w-12 mb-2" />
            <p>Complete a timer session to see metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate chart data from the metrics
  const focusData = generateFocusData(metrics);
  const efficiencyData = [
    { name: 'Expected', value: metrics.expectedTime ? secondsToMinutes(metrics.expectedTime) : 0 },
    { name: 'Actual', value: metrics.actualDuration ? secondsToMinutes(metrics.actualDuration) : 0 },
    { name: 'Effective', value: metrics.netEffectiveTime ? secondsToMinutes(metrics.netEffectiveTime) : 0 }
  ];

  // Event to share metrics with parent (using useEvent hook)
  useEvent('metrics:share', () => metrics);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Timer Metrics</CardTitle>
        <CardDescription>
          {metrics.completionStatus} - {metrics.completionDate ? new Date(metrics.completionDate).toLocaleDateString() : 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showExtended && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Focus Over Time</CardTitle>
                <CardDescription>Focus level every 5 minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={focusData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="focus" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Efficiency</CardTitle>
                <CardDescription>Comparison of expected, actual, and effective time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={efficiencyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pauses</CardTitle>
              <CardDescription>Number of pauses during the session</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metrics.pauseCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Efficiency Ratio</CardTitle>
              <CardDescription>Ratio of effective time to actual time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{(metrics.efficiencyRatio || 0).toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

function generateFocusData(metrics: any) {
  // Create focus data points every 5 minutes
  const focusData = [];
  
  if (metrics.startTime && metrics.endTime) {
    const startTime = new Date(metrics.startTime).getTime();
    const endTime = new Date(metrics.endTime).getTime();
    const duration = endTime - startTime;
    const interval = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    for (let i = 0; i < duration; i += interval) {
      const time = new Date(startTime + i);
      const focusLevel = Math.random() * 100; // Generate a random focus level for demonstration
      focusData.push({
        name: time.toLocaleTimeString(),
        focus: focusLevel.toFixed(0)
      });
    }
  }
  
  return focusData;
}
