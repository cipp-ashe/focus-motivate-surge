
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { HabitTemplateManager } from './HabitTemplateManager';
import { ActiveTemplate, HabitDetail } from '@/types/habits/types';
import { useHabitContext } from '@/contexts/habits/HabitContext';
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker';
import { getTodaysHabits } from '@/utils/habitUtils';
import { useTemplateManagement } from '@/hooks/habits/useTemplateManagement';

const HabitTracker: React.FC = () => {
  const { templates, addTemplate: addTemplateContext, updateTemplate: updateTemplateContext, removeTemplate: removeTemplateContext } = useHabitContext();

  // Template management functions
  const { activeTemplates, addTemplate, updateTemplate, removeTemplate, updateTemplateOrder, updateTemplateDays } = useTemplateManagement();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('calendar');

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
              <CalendarDateRangePicker
                date={selectedDate}
                onDateChange={setSelectedDate}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          <div className="h-full">
            <HabitTemplateManager 
              activeTemplates={activeTemplates}
              addTemplate={addTemplate}
              removeTemplate={removeTemplate}
              configureTemplate={(template) => updateTemplate(template.templateId, template)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HabitTracker;
