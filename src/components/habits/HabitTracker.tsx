
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HabitTemplateManager } from './HabitTemplateManager';
import { useHabitContext } from '@/contexts/habits/HabitContext';
import { useTemplateManagement } from '@/hooks/habits/useTemplateManagement';

export const HabitTracker: React.FC = () => {
  const { templates, addTemplate: addTemplateContext, removeTemplate: removeTemplateContext } = useHabitContext();

  // Template management functions
  const { activeTemplates, addTemplate, updateTemplate, removeTemplate, updateTemplateOrder, updateTemplateDays } = useTemplateManagement();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('calendar');

  // Handle adding a template by ID
  const handleAddTemplate = (templateId: string) => {
    addTemplate(templateId);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Habit Calendar</CardTitle>
              <CardDescription>Track your habit streaks over time</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          <div className="h-full">
            <HabitTemplateManager 
              activeTemplates={activeTemplates}
              addTemplate={handleAddTemplate}
              removeTemplate={removeTemplate}
              configureTemplate={(template) => updateTemplate(template.templateId, template)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
