
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Check, Edit, Trash } from 'lucide-react';
import { HabitTemplate } from '@/types/habits/types';
import { HabitMetrics } from '@/types/habits/unified';
import { Badge } from '@/components/ui/badge';

interface TemplateCardProps {
  template: HabitTemplate;
  isActive?: boolean;
  onSelect?: () => void;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelectionMode?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isActive = false,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  isSelectionMode = false
}) => {
  const handleAction = () => {
    if (isSelectionMode && onSelect) {
      onSelect();
    } else if (onAdd) {
      onAdd();
    }
  };
  
  return (
    <Card className={`transition-all ${isActive ? 'border-primary/40' : 'hover:border-primary/20'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{template.name}</CardTitle>
            <CardDescription className="text-xs mt-0.5">{template.description}</CardDescription>
          </div>
          
          {template.category && (
            <Badge variant="outline" className="text-xs h-5 font-normal">
              {template.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="text-xs text-muted-foreground">
          <p>Contains {template.defaultHabits.length} habits</p>
          
          {template.defaultDays && (
            <p className="mt-0.5">
              Active: {template.defaultDays.join(', ')}
            </p>
          )}
        </div>
        
        {/* Display a sample of habits */}
        {template.defaultHabits.length > 0 && (
          <div className="mt-2 space-y-1">
            {template.defaultHabits.slice(0, 3).map((habit) => (
              <div key={habit.id} className="text-xs flex justify-between items-center">
                <span>{habit.name}</span>
                <span className="text-xs text-muted-foreground">
                  {habit.metrics.type}
                </span>
              </div>
            ))}
            {template.defaultHabits.length > 3 && (
              <div className="text-xs text-muted-foreground italic">
                + {template.defaultHabits.length - 3} more habits
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full flex justify-between">
          {isSelectionMode ? (
            <Button 
              onClick={handleAction} 
              variant={isActive ? "secondary" : "default"}
              className="w-full"
              disabled={isActive}
            >
              {isActive ? <Check className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              {isActive ? 'Already Added' : 'Select Template'}
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleAction} 
                variant={isActive ? "secondary" : "default"}
                className="flex-1"
                disabled={isActive}
              >
                {isActive ? <Check className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                {isActive ? 'Added' : 'Add'}
              </Button>
              
              {onEdit && (
                <Button 
                  onClick={onEdit} 
                  variant="outline" 
                  size="icon" 
                  className="ml-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              {onDelete && (
                <Button 
                  onClick={onDelete} 
                  variant="outline" 
                  size="icon" 
                  className="ml-2"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
