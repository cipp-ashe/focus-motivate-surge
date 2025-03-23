
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, CheckCircle2, AlignJustify } from "lucide-react";
import { HabitDetail, HabitMetrics } from './types';

interface TemplateCardProps {
  title: string;
  description: string;
  habits: HabitDetail[];
  onAdd: () => void;
  onConfigure?: () => void;
  isActive?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  description,
  habits,
  onAdd,
  onConfigure,
  isActive = false,
}) => {
  // Get icon based on habit metric type
  const getHabitIcon = (metrics?: HabitMetrics) => {
    if (!metrics) return <CheckCircle2 className="h-4 w-4" />;
    
    switch (metrics.type) {
      case 'timer':
        return <Timer className="h-4 w-4" />;
      case 'journal':
        return <AlignJustify className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`${isActive ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="font-medium text-xs">Habits included:</p>
        <ul className="space-y-1">
          {habits.slice(0, 3).map((habit) => (
            <li key={habit.id} className="flex items-center gap-2 text-xs">
              {getHabitIcon(habit.metrics)}
              <span>{habit.name}</span>
            </li>
          ))}
          {habits.length > 3 && (
            <li className="text-xs text-muted-foreground">
              +{habits.length - 3} more
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant={isActive ? "outline" : "default"}
          size="sm"
          className="w-full text-xs"
          onClick={onAdd}
        >
          {isActive ? "Remove" : "Add"}
        </Button>
        {onConfigure && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={onConfigure}
          >
            Configure
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
