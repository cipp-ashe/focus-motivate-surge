
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HabitTemplateManager } from './HabitTemplateManager';
import { useHabitContext } from '@/contexts/habits/HabitContext';
import { useTemplateManagement } from '@/hooks/habits/useTemplateManagement';

export const HabitTracker: React.FC = () => {
  const { templates } = useHabitContext();

  // Template management functions
  const { activeTemplates, addTemplate, updateTemplate, removeTemplate } = useTemplateManagement();

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
          <Card className="dark:bg-gray-900/60 dark:border-gray-800/50">
            <CardHeader>
              <CardTitle className="dark:text-gray-200">Habit Calendar</CardTitle>
              <CardDescription className="dark:text-gray-400">Track your habit streaks over time</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border dark:border-gray-800 dark:bg-gray-900/40"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          <div className="h-full dark:text-gray-200">
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
