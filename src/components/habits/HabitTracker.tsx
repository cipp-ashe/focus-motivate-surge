
import React, { useState, useEffect } from 'react';
import { habitTemplates } from '../../utils/habitTemplates';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { useHabitProgress } from './hooks/useHabitProgress';
import { useTemplateCreation } from './hooks/useTemplateCreation';
import { HabitTemplate, DayOfWeek } from './types';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import TemplateSelectionSheet from './TemplateSelectionSheet';
import TemplateConfigurationSheet from './TemplateConfigurationSheet';

const HabitTracker: React.FC = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [allTemplates, setAllTemplates] = useState<HabitTemplate[]>(habitTemplates);

  const {
    activeTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
    updateTemplateDays,
  } = useTemplateManagement();

  const {
    getTodayProgress,
    updateProgress,
  } = useHabitProgress();

  const {
    selectedTemplate,
    isCreatingTemplate,
    newTemplateName,
    setNewTemplateName,
    handleCreateTemplate,
    handleConfigureTemplate,
    handleCloseTemplate,
    handleSaveTemplate,
  } = useTemplateCreation(addTemplate, updateTemplate);

  // Load custom templates from localStorage
  useEffect(() => {
    const loadCustomTemplates = () => {
      const customTemplatesStr = localStorage.getItem('custom-templates');
      const customTemplates = customTemplatesStr ? JSON.parse(customTemplatesStr) : [];
      setAllTemplates([...habitTemplates, ...customTemplates]);
    };

    loadCustomTemplates();
    window.addEventListener('templatesUpdated', loadCustomTemplates);
    
    return () => {
      window.removeEventListener('templatesUpdated', loadCustomTemplates);
    };
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    const template = allTemplates.find(t => t.id === templateId);
    if (template) {
      addTemplate({
        templateId: template.id,
        habits: template.defaultHabits || [],
        activeDays: template.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        customized: false,
      });
      setIsConfigOpen(false);
      window.dispatchEvent(new Event('templatesUpdated'));
    }
  };

  const handleUpdateTemplate = (updates: Partial<typeof selectedTemplate>) => {
    if (!selectedTemplate) return;
    handleConfigureTemplate({ ...selectedTemplate, ...updates });
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <HabitTrackerHeader onConfigureTemplates={() => setIsConfigOpen(true)} />

      <ActiveTemplateList
        activeTemplates={activeTemplates}
        onConfigure={handleConfigureTemplate}
        onRemove={removeTemplate}
        getTodayProgress={getTodayProgress}
        onHabitUpdate={updateProgress}
      />

      <TemplateSelectionSheet
        isOpen={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        allTemplates={allTemplates}
        activeTemplateIds={activeTemplates.map(t => t.templateId)}
        onSelectTemplate={handleTemplateSelect}
        onCreateTemplate={handleCreateTemplate}
      />

      <TemplateConfigurationSheet
        selectedTemplate={selectedTemplate}
        isCreatingTemplate={isCreatingTemplate}
        newTemplateName={newTemplateName}
        onNewTemplateNameChange={setNewTemplateName}
        onClose={handleCloseTemplate}
        onUpdateTemplate={handleUpdateTemplate}
        onUpdateDays={updateTemplateDays}
        onSave={handleSaveTemplate}
      />
    </div>
  );
};

export default HabitTracker;
