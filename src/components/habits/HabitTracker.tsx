
import React, { useState } from 'react';
import { habitTemplates } from '../../utils/habitTemplates';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { useHabitProgress } from './hooks/useHabitProgress';
import { useTemplateCreation } from './hooks/useTemplateCreation';
import { HabitTemplate, ActiveTemplate } from './types';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import TemplateSelectionSheet from './TemplateSelectionSheet';

interface HabitTrackerProps {
  activeTemplates: ActiveTemplate[];
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ activeTemplates }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [allTemplates, setAllTemplates] = useState<HabitTemplate[]>(habitTemplates);

  const {
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
  } = useTemplateCreation((template: ActiveTemplate) => {
    updateTemplate(template.templateId, template);
  }, updateTemplate);

  // Load custom templates from localStorage
  React.useEffect(() => {
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

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <HabitTrackerHeader onConfigureTemplates={() => setIsConfigOpen(true)} />

      <ActiveTemplateList
        activeTemplates={activeTemplates}
        onRemove={removeTemplate}
        getTodayProgress={getTodayProgress}
        onHabitUpdate={updateProgress}
      />

      <TemplateSelectionSheet
        isOpen={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        allTemplates={allTemplates}
        activeTemplateIds={activeTemplates.map(t => t.templateId)}
        onSelectTemplate={(template: HabitTemplate) => {
          updateTemplate(template.id, {
            templateId: template.id,
            habits: template.defaultHabits,
            activeDays: template.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            customized: false,
          });
          setIsConfigOpen(false);
        }}
        onCreateTemplate={handleCreateTemplate}
      />
    </div>
  );
};

export default HabitTracker;
