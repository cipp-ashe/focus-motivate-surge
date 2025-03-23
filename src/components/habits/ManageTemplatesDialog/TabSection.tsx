import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitTemplate, NewTemplate, TabSectionProps, createEmptyHabit } from '../types';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TemplateCardView from "./TemplateCardView";
import { toast } from "sonner";
import { predefinedTemplates } from "../data/templates";

const TabSection: React.FC<TabSectionProps> = ({
  customTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onDeleteCustomTemplate,
  onCreateTemplate
}) => {
  const [newTemplateName, setNewTemplateName] = React.useState("");
  const [newTemplateDescription, setNewTemplateDescription] = React.useState("");
  const [newTemplateHabits, setNewTemplateHabits] = React.useState<string[]>([]);
  const [currentHabit, setCurrentHabit] = React.useState("");

  // Convert templates to properly match the HabitTemplate interface
  const fixedCustomTemplates: HabitTemplate[] = customTemplates.map(template => {
    // Make sure the template has defaultHabits property
    if (!('defaultHabits' in template)) {
      return {
        ...template,
        defaultHabits: (template as any).habits?.map((habit: any) => ({
          id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: typeof habit === 'string' ? habit : habit.name,
          description: typeof habit === 'string' ? '' : (habit.description || '')
        })) || []
      };
    }
    return template;
  });

  const handleAddHabit = () => {
    if (!currentHabit.trim()) return;
    
    setNewTemplateHabits([...newTemplateHabits, currentHabit.trim()]);
    setCurrentHabit("");
  };

  const handleRemoveHabit = (index: number) => {
    setNewTemplateHabits(newTemplateHabits.filter((_, i) => i !== index));
  };

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error("Template name required");
      return;
    }

    if (newTemplateHabits.length === 0) {
      toast.error("Habits required");
      return;
    }

    const newTemplate: NewTemplate = {
      name: newTemplateName.trim(),
      description: newTemplateDescription.trim() || `Custom template for ${newTemplateName.trim()}`,
      defaultHabits: newTemplateHabits.map(habit => ({
        id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: habit,
        description: ""
      }))
    };
    
    onCreateTemplate(newTemplate);
    
    // Reset form
    setNewTemplateName("");
    setNewTemplateDescription("");
    setNewTemplateHabits([]);
    setCurrentHabit("");
    
    toast.success("Template created");
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="all">All Templates</TabsTrigger>
        <TabsTrigger value="custom">My Templates</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predefinedTemplates.map((template) => (
              <TemplateCardView
                key={template.id}
                template={template}
                isActive={activeTemplateIds.includes(template.id)}
                onSelect={() => onSelectTemplate(template)}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="custom" className="space-y-4">
        <ScrollArea className="h-[250px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fixedCustomTemplates.length > 0 ? (
              fixedCustomTemplates.map((template) => (
                <TemplateCardView
                  key={template.id}
                  template={template}
                  isActive={activeTemplateIds.includes(template.id)}
                  isCustom={true}
                  onSelect={() => onSelectTemplate(template)}
                  onDelete={() => onDeleteCustomTemplate(template.id)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                No custom templates yet. Create one below.
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Create New Template</h3>
            
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Template Name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Template Description (optional)"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Habits</h4>
                <div className="space-y-2">
                  {newTemplateHabits.map((habit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1 bg-muted/30 p-2 rounded-md text-sm">
                        {habit}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveHabit(index)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add a habit"
                      value={currentHabit}
                      onChange={(e) => setCurrentHabit(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHabit();
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAddHabit}
                      className="h-10 w-10 flex-shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleCreateTemplate}
                className="w-full"
                disabled={!newTemplateName.trim() || newTemplateHabits.length === 0}
              >
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TabSection;
