import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HabitDetail, HabitMetricType, ActiveTemplate } from './types';
import { X, Check, Calendar, Settings, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import HabitRow from './HabitRow';

interface ProgressInfo {
  value: boolean | number;
  streak: number;
}

interface TemplateCardProps {
  template: ActiveTemplate;
  templateInfo: any;
  onRemove: () => void;
  onEdit: () => void;
  getProgress: (habitId: string) => ProgressInfo;
  onHabitUpdate: (habitId: string, value: boolean | number) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  templateInfo,
  onRemove,
  onEdit,
  getProgress,
  onHabitUpdate
}) => {
  const [expanded, setExpanded] = useState(true);
  
  // Helper function to determine the display value based on metric type
  const getDisplayValue = (habit: HabitDetail, value: boolean | number): string => {
    if (typeof value === 'boolean') {
      return value ? 'Complete' : 'Incomplete';
    }
    
    if (habit.metrics.type === HabitMetricType.Number) {
      return `${value} / ${habit.metrics.target}`;
    }
    
    return String(value);
  };
  
  // Helper function to determine the color based on progress
  const getProgressColor = (habit: HabitDetail, value: boolean | number): string => {
    if (typeof value === 'boolean') {
      return value ? 'text-green-500' : 'text-red-500';
    }
    
    if (habit.metrics.type === HabitMetricType.Number) {
      const progress = (Number(value) / Number(habit.metrics.target)) * 100;
      if (progress >= 100) {
        return 'text-green-500';
      } else if (progress > 0) {
        return 'text-yellow-500';
      } else {
        return 'text-red-500';
      }
    }
    
    return 'text-gray-500';
  };

  return (
    <Card className="w-full transition-all shadow-sm hover:shadow-md h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">
              {templateInfo?.name || 'Custom Template'}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {templateInfo?.description || 'Your custom habit template'}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRemove} className="text-destructive">
                <X className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {template.activeDays?.map((day) => (
            <Badge key={day} variant="outline" className="text-xs">
              {day}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto">
        <div className="space-y-2">
          {template.habits?.map(habit => (
            <HabitRow 
              key={habit.id}
              habit={habit}
              progress={getProgress(habit.id)}
              onUpdate={(value) => onHabitUpdate(habit.id, value)}
            />
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 text-xs text-muted-foreground flex justify-between">
        <span>{template.habits?.length || 0} habits</span>
        <span className="flex items-center">
          <Calendar className="mr-1 h-3 w-3" />
          {template.customized ? 'Customized' : 'Default'} template
        </span>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
