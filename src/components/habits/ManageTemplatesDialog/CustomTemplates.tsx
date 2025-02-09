
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { HabitTemplate } from '../types';
import { toast } from 'sonner';

interface CustomTemplatesProps {
  templates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelect: (template: HabitTemplate) => void;
  onDelete?: (templateId: string) => void;
}

const CustomTemplates: React.FC<CustomTemplatesProps> = ({
  templates,
  activeTemplateIds,
  onSelect,
  onDelete,
}) => {
  if (templates.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No custom templates yet. Create your first template to see it here.
      </div>
    );
  }

  const handleDelete = (templateId: string) => {
    if (onDelete) {
      onDelete(templateId);
      toast.success('Template deleted successfully');
    }
  };

  return (
    <div className="grid gap-3 mt-4">
      {templates.map((template) => (
        <Card key={template.id} className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{template.name}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {template.description || 'No description'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(template.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelect(template)}
                disabled={activeTemplateIds.includes(template.id)}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                {activeTemplateIds.includes(template.id) ? 'Added' : 'Add'}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CustomTemplates;

