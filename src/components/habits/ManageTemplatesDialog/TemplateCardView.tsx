
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { HabitTemplate } from '../types';

interface TemplateCardViewProps {
  template: HabitTemplate;
  isActive: boolean;
  isCustom?: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}

const TemplateCardView: React.FC<TemplateCardViewProps> = ({
  template,
  isActive,
  isCustom = false,
  onSelect,
  onDelete,
}) => {
  return (
    <Card 
      className={cn(
        "bg-card border-border/60 transition-all duration-200 hover:shadow-md",
        isActive ? "border-primary/60 ring-1 ring-primary/10" : "hover:border-primary/30"
      )}
    >
      <CardHeader className={cn("pb-2", isCustom && "flex flex-row items-start justify-between")}>
        <div>
          <CardTitle className="text-base font-medium">{template.name}</CardTitle>
          <CardDescription className="text-xs">{template.description}</CardDescription>
        </div>
        {isCustom && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-7 w-7 -mt-1 -mr-1 text-destructive/80 hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">Includes:</p>
        <ul className="space-y-1 text-xs mb-1">
          {template.defaultHabits.map((habit) => (
            <li key={habit.id} className="flex items-start">
              <Check className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-primary/80" />
              <span>{habit.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant={isActive ? "secondary" : "default"}
          size="sm"
          className={cn(
            "w-full", 
            !isActive && "bg-primary/90 hover:bg-primary/95",
            "text-xs whitespace-normal h-auto py-1.5"
          )}
          onClick={onSelect}
          disabled={isActive}
        >
          {isActive ? (
            <Check className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          ) : (
            <Plus className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          )}
          <span>{isActive ? "Already Added" : "Add Template"}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCardView;
