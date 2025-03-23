
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateTemplateForm from './CreateTemplateForm';
import CustomTemplates from './CustomTemplates';
import AvailableTemplates from './AvailableTemplates';

interface TabSectionProps {
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
  onTemplateCreate?: (templateName: string, habits: string[]) => void;
  onTemplateDelete?: (templateId: string) => void;
  onTemplateApply?: (templateId: string) => void;
  userTemplates: {
    id: string;
    name: string;
    habits: string[];
    createdAt: string;
  }[];
  predefinedTemplates: {
    id: string;
    name: string;
    description: string;
    habits: string[];
  }[];
  isMobile?: boolean;
}

const TabSection: React.FC<TabSectionProps> = ({
  defaultTab = 'available',
  onTabChange,
  onTemplateCreate,
  onTemplateDelete,
  onTemplateApply,
  userTemplates,
  predefinedTemplates,
  isMobile = false,
}) => {
  const handleValueChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Tabs defaultValue={defaultTab} onValueChange={handleValueChange} className="w-full">
      <div className="flex justify-center mb-4">
        <TabsList>
          <TabsTrigger value="available">Available Templates</TabsTrigger>
          <TabsTrigger value="custom">Your Templates</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="available" className="mt-6 space-y-4">
        <AvailableTemplates 
          templates={predefinedTemplates}
          onApply={onTemplateApply}
          isMobile={isMobile}
        />
      </TabsContent>

      <TabsContent value="custom" className="mt-6 space-y-4">
        <CustomTemplates 
          templates={userTemplates}
          onDelete={onTemplateDelete}
          onApply={onTemplateApply}
          isMobile={isMobile}
        />
      </TabsContent>

      <TabsContent value="create" className="mt-6">
        <CreateTemplateForm 
          onSubmit={(name, habits) => {
            if (onTemplateCreate) {
              onTemplateCreate(name, habits);
            }
          }}
          submitButtonSize="default"
        />
      </TabsContent>
    </Tabs>
  );
};

export default TabSection;
