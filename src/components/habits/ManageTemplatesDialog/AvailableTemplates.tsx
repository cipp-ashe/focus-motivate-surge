
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { HabitTemplate } from '../types';

interface AvailableTemplatesProps {
  templates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelect: (template: HabitTemplate) => void;
}

const AvailableTemplates: React.FC<AvailableTemplatesProps> = ({
  templates,
  activeTemplateIds,
  onSelect,
}) => {
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
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
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
                  "w-full py-2 h-auto min-h-10", 
                  !isActive && "bg-primary hover:bg-primary/90"
                )}
                onClick={() => onSelect(template)}
                disabled={isActive}
              >
                {isActive ? (
                  <Check className="h-4 w-4 mr-2 flex-shrink-0" />
                ) : (
                  <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                )}
                <span className="whitespace-nowrap">{isActive ? "Already Added" : "Add Template"}</span>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default AvailableTemplates;
