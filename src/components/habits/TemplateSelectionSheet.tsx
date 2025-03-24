
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { HabitTemplate } from '@/types/habits/types';
import { useHabitContext } from '@/contexts/habits/HabitContext';

interface TemplateSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (templateId: string) => void;
}

export const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  open,
  onOpenChange,
  onSelect
}) => {
  const [activeTab, setActiveTab] = useState('recommended');
  const { templates, addTemplate } = useHabitContext();
  
  // Mock recommended templates
  const recommendedTemplates: HabitTemplate[] = [
    {
      id: 'morning-routine',
      name: 'Morning Routine',
      description: 'Start your day with purpose',
      habits: [
        { id: 'mr-1', name: 'Drink water', description: 'Hydrate after waking up', metricType: 'boolean' },
        { id: 'mr-2', name: 'Meditate', description: '10 minutes of mindfulness', metricType: 'timer', duration: 10 }
      ]
    },
    {
      id: 'work-productivity',
      name: 'Work Productivity',
      description: 'Stay focused during work hours',
      habits: [
        { id: 'wp-1', name: 'Check email', description: 'Process inbox twice a day', metricType: 'boolean' },
        { id: 'wp-2', name: 'Focus session', description: '25-minute deep work sessions', metricType: 'timer', duration: 25 }
      ]
    }
  ];

  const handleSelectTemplate = (templateId: string) => {
    onSelect(templateId);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Template</SheetTitle>
          <SheetDescription>
            Choose a template to add to your active templates
          </SheetDescription>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="custom">My Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {recommendedTemplates.map((template) => (
                  <div key={template.id} className="border rounded-md p-4">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <div className="mt-2">
                      <p className="text-xs font-medium">Habits:</p>
                      <ul className="text-xs list-disc pl-4 mt-1">
                        {template.habits.map((habit) => (
                          <li key={habit.id}>{habit.name}</li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      onClick={() => handleSelectTemplate(template.id)} 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 w-full"
                    >
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-md p-4">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <Button 
                      onClick={() => handleSelectTemplate(template.id)} 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 w-full"
                    >
                      Use Template
                    </Button>
                  </div>
                ))}
                
                {templates.length === 0 && (
                  <div className="text-center p-8 border rounded-md">
                    <p className="text-muted-foreground">No custom templates yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                    >
                      Create Template
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
