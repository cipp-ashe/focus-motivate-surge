
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, CheckCircle2, AlignJustify } from "lucide-react";
import { ActiveTemplate, HabitDetail, HabitTemplate, HabitMetrics } from './types';

interface TemplateCardProps {
  title?: string;
  description?: string;
  habits?: HabitDetail[];
  onAdd?: () => void;
  onConfigure?: () => void;
  isActive?: boolean;
  // New props to support ActiveTemplateList usage
  template?: ActiveTemplate;
  templateInfo?: HabitTemplate | {
    id: string;
    name: string;
    description: string;
    defaultHabits: HabitDetail[];
    defaultDays: string[];
  };
  onRemove?: () => void;
  onEdit?: () => void;
  getProgress?: (habitId: string) => { value: boolean | number; streak: number; };
  onHabitUpdate?: (habitId: string, value: any) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  description,
  habits,
  onAdd,
  onConfigure,
  isActive = false,
  // Support for new props
  template,
  templateInfo,
  onRemove,
  onEdit,
  getProgress,
  onHabitUpdate
}) => {
  // Use provided habits directly, or get them from template/templateInfo
  const displayHabits = habits || 
                        (template?.habits) || 
                        (templateInfo?.defaultHabits) || 
                        [];
  
  // Use provided title/description or get from template/templateInfo
  const displayTitle = title || 
                      (template?.name) || 
                      (templateInfo?.name) || 
                      "";
  
  const displayDescription = description || 
                            (template?.description) || 
                            (templateInfo?.description) || 
                            "";

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

  // Determine which footer buttons to show based on provided props
  const renderFooterButtons = () => {
    if (onRemove && onEdit) {
      return (
        <>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={onRemove}
          >
            Remove
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={onEdit}
          >
            Configure
          </Button>
        </>
      );
    }
    
    return (
      <>
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
      </>
    );
  };

  return (
    <Card className={`${isActive ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-base">{displayTitle}</CardTitle>
        <CardDescription className="text-xs">{displayDescription}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="font-medium text-xs">Habits included:</p>
        <ul className="space-y-1">
          {displayHabits.slice(0, 3).map((habit) => (
            <li key={habit.id} className="flex items-center gap-2 text-xs">
              {getHabitIcon(habit.metrics)}
              <span>{habit.name}</span>
            </li>
          ))}
          {displayHabits.length > 3 && (
            <li className="text-xs text-muted-foreground">
              +{displayHabits.length - 3} more
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="flex gap-2">
        {renderFooterButtons()}
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
