
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { HabitTemplate, NewTemplate } from '@/components/habits/types';
import TemplateCard from '@/components/habits/TemplateCard';
import CreateTemplateForm from './CreateTemplateForm';

interface TabSectionProps {
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onDeleteCustomTemplate: (templateId: string) => void;
  onCreateTemplate: (template: NewTemplate) => void;
}

const TabSection: React.FC<TabSectionProps> = ({
  customTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onDeleteCustomTemplate,
  onCreateTemplate,
}) => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <Tabs defaultValue="templates" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="create">Create New</TabsTrigger>
      </TabsList>
      
      <TabsContent value="templates" className="space-y-4">
        {customTemplates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No templates available. Create a new one!
          </div>
        ) : (
          <div className="grid gap-4">
            {customTemplates.map((template) => {
              const isActive = activeTemplateIds.includes(template.id);
              
              return (
                <TemplateCard
                  key={template.id}
                  title={template.name}
                  description={template.description}
                  habits={template.defaultHabits || []}
                  isActive={isActive}
                  onAdd={() => onSelectTemplate(template)}
                  templateInfo={template}
                  onRemove={() => onDeleteCustomTemplate(template.id)}
                />
              );
            })}
          </div>
        )}
        
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Template
        </Button>
      </TabsContent>
      
      <TabsContent value="create">
        <CreateTemplateForm
          onSubmit={(data) => {
            onCreateTemplate({
              name: data.name,
              description: data.description,
              defaultHabits: data.habits,
              defaultDays: data.defaultDays,
              category: data.category
            });
            setIsCreating(false);
          }}
          onCancel={() => setIsCreating(false)}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TabSection;
