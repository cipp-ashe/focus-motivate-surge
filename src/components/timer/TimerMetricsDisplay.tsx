
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  CheckSquare, 
  TrendingUp, 
  BarChart4, 
  Timer as TimerIcon 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { calculateEfficiencyRatio } from '@/utils/timeUtils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export function TimerMetricsDisplay() {
  // In a real implementation, these values would be calculated from actual timer data
  const focusTime = { hours: 4, minutes: 32 };
  const tasksCompleted = 12;
  const avgSessionLength = 25;
  const completionRate = 89;
  const currentStreak = 5;
  
  // Sample efficiency calculation
  const sampleEfficiency = calculateEfficiencyRatio(1500, 1250); // 25 min expected, 20.8 min actual
  
  return (
    <div className="space-y-6 p-2 max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          title="Focus Time"
          value={`${focusTime.hours}h ${focusTime.minutes}m`}
          description="This week"
          icon={<Clock className="h-5 w-5" />}
          variant="default"
        />
        
        <MetricCard
          title="Tasks Completed"
          value={tasksCompleted}
          description="This week"
          icon={<CheckSquare className="h-5 w-5" />}
          variant="success"
        />
        
        <MetricCard
          title="Avg. Session"
          value={`${avgSessionLength} min`}
          description="Per timer"
          icon={<TimerIcon className="h-5 w-5" />}
          variant="info"
        />
        
        <MetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          description="Tasks finished"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="warning"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <BarChart4 className="h-5 w-5 mr-2 text-primary" />
          Weekly Focus Distribution
        </h3>
        <Separator className="mb-4" />
        
        <div className="bg-accent/5 rounded-lg p-4 min-h-32 flex flex-col justify-center items-center">
          <div className="flex w-full justify-between mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center">
                <div className="flex flex-col items-center">
                  <div 
                    className="bg-primary/70 w-8 rounded-t-sm" 
                    style={{ 
                      height: `${Math.floor(Math.random() * 50) + 20}px`,
                      opacity: day === 'Wed' ? 1 : 0.7 
                    }}
                  ></div>
                  <div className="text-xs mt-1 text-muted-foreground">{day}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Wednesday was your most productive day
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Current Streak</h3>
        <Separator className="mb-4" />
        
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">You're on a roll!</p>
            <p className="text-2xl font-bold">{currentStreak} days</p>
          </div>
          <div className="flex">
            {Array(5).fill(null).map((_, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 rounded-full mx-1 flex items-center justify-center ${
                  i < currentStreak ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                {i < currentStreak && <CheckSquare className="h-3 w-3" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Efficiency Rate</h3>
        <Separator className="mb-4" />
        
        <div className="bg-accent/5 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Less Efficient</span>
            <span className="text-sm text-muted-foreground">More Efficient</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${sampleEfficiency}%` }}
            ></div>
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-sm font-medium">
              You're {Math.round(sampleEfficiency)}% efficient in your focus sessions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, description, icon, variant = 'default' }: MetricCardProps) {
  const bgColorMap = {
    default: 'bg-primary/10',
    success: 'bg-green-500/10',
    warning: 'bg-amber-500/10',
    info: 'bg-blue-500/10'
  };
  
  const textColorMap = {
    default: 'text-primary',
    success: 'text-green-500',
    warning: 'text-amber-500',
    info: 'text-blue-500'
  };
  
  return (
    <Card className="border-border/10">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`${bgColorMap[variant]} p-2 rounded-full ${textColorMap[variant]}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
