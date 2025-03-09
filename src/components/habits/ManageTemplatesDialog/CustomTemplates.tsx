
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { HabitTemplate } from '../types';

interface CustomTemplatesProps {
  templates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelect: (template: HabitTemplate) => void;
  onDelete: (templateId: string) => void;
}

const CustomTemplates: React.FC<CustomTemplatesProps> = ({
  templates,
  activeTemplateIds,
  onSelect,
  onDelete,
}) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No custom templates yet.</p>
        <p className="mt-1">Create one using the button above.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {templates.map((template) => {
        const isActive = activeTemplateIds.includes(template.id);
        
        return (
          <Card 
            key={template.id} 
            className={cn(
              "bg-card border-border transition-all duration-200 hover:shadow-md",
              isActive ? "border-primary ring-1 ring-primary/20" : "hover:border-primary/50"
            )}
          >
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(template.id);
                }}
                className="h-8 w-8 -mt-1 -mr-1 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Includes:</p>
              <ul className="space-y-1.5 text-sm mb-1.5">
                {template.defaultHabits.map((habit) => (
                  <li key={habit.id} className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>{habit.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={isActive ? "secondary" : "default"}
                className={cn(
                  "w-full", 
                  !isActive && "bg-primary hover:bg-primary/90"
                )}
                onClick={() => onSelect(template)}
                disabled={isActive}
              >
                {isActive ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {isActive ? "Already Added" : "Add Template"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default CustomTemplates;
