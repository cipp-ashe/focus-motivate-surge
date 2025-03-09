
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitTemplate } from '../types';
import AvailableTemplates from './AvailableTemplates';
import CustomTemplates from './CustomTemplates';
import CreateTemplateForm from './CreateTemplateForm';

interface TabSectionProps {
  allTemplates: HabitTemplate[];
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onDeleteCustomTemplate: (templateId: string) => void;
  onCreateTemplate: (newTemplate: Omit<HabitTemplate, 'id'>) => void;
}

const TabSection: React.FC<TabSectionProps> = ({
  allTemplates,
  customTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onDeleteCustomTemplate,
  onCreateTemplate,
}) => {
  const [activeTab, setActiveTab] = useState("built-in");
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  if (isCreatingNew) {
    return (
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => setIsCreatingNew(false)}
            className="mb-2"
          >
            ← Back to Templates
          </Button>
          <h3 className="text-lg font-medium">Create New Template</h3>
        </div>
        <CreateTemplateForm 
          onSubmit={(template) => {
            onCreateTemplate(template);
            setIsCreatingNew(false);
          }} 
          onCancel={() => setIsCreatingNew(false)} 
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <Tabs defaultValue="built-in" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="built-in">Built-in Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="built-in" className="mt-0">
          <AvailableTemplates 
            templates={allTemplates}
            activeTemplateIds={activeTemplateIds}
            onSelect={onSelectTemplate}
          />
        </TabsContent>
        
        <TabsContent value="custom" className="mt-0">
          <div className="mb-4">
            <Button 
              onClick={() => setIsCreatingNew(true)}
              className="w-full"
              size="auto"
            >
              Create New Template
            </Button>
          </div>
          <CustomTemplates 
            templates={customTemplates}
            activeTemplateIds={activeTemplateIds}
            onSelect={onSelectTemplate}
            onDelete={onDeleteCustomTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabSection;
