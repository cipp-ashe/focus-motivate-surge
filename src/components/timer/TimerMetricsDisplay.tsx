
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BarChart, Clock, Activity, Calendar, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TimerMetricsDisplay = () => {
  // These would normally come from actual metrics tracking
  const metrics = {
    totalSessions: 12,
    totalFocusTime: 345, // in minutes
    averageSessionLength: 28.75, // in minutes
    completionRate: 85, // percentage
    currentStreak: 3, // days
    bestStreak: 5, // days
    thisWeekSessions: 4,
    lastWeekSessions: 6,
    weeklyChange: -33.33, // percentage
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium flex items-center">
          <Activity className="mr-2 h-5 w-5 text-purple-500" />
          Focus Metrics
        </h2>
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid grid-cols-2 gap-3">
        <MetricCard 
          title="Total Sessions" 
          value={metrics.totalSessions.toString()} 
          icon={<Calendar className="h-4 w-4 text-purple-500" />} 
        />
        
        <MetricCard 
          title="Total Focus" 
          value={`${metrics.totalFocusTime} min`} 
          icon={<Clock className="h-4 w-4 text-purple-500" />} 
        />
      </div>
      
      <Card className="bg-card/60 border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{metrics.completionRate}%</span>
            </div>
            <Progress value={metrics.completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/60 border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-amber-500 mr-2" />
            <div>
              <p className="text-2xl font-bold">{metrics.currentStreak}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">Best Streak</p>
            <p className="text-xl font-medium">{metrics.bestStreak} days</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/60 border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground">This Week</p>
              <p className="text-lg font-medium">{metrics.thisWeekSessions} sessions</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Last Week</p>
              <p className="text-lg font-medium">{metrics.lastWeekSessions} sessions</p>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <span className={`text-xs font-medium ${metrics.weeklyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.weeklyChange >= 0 ? '↑' : '↓'} {Math.abs(metrics.weeklyChange)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Simple metric card component
function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-card/60 border-primary/10">
      <CardContent className="p-4 flex items-center space-x-3">
        <div className="bg-primary/10 p-2 rounded-full">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default TimerMetricsDisplay;
