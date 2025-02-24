
import React, { useState } from 'react';
import { habitTemplates } from '../../utils/habitTemplates';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { useHabitProgress } from './hooks/useHabitProgress';
import { useTemplateCreation } from './hooks/useTemplateCreation';
import { HabitTemplate, ActiveTemplate } from './types';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import TemplateSelectionSheet from './TemplateSelectionSheet';
import { eventBus } from '@/lib/eventBus';

interface HabitTrackerProps {
  activeTemplates: ActiveTemplate[];
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ activeTemplates }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [allTemplates, setAllTemplates] = useState<HabitTemplate[]>(habitTemplates);

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
  } = useTemplateCreation(() => {}, () => {});

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
        getTodayProgress={getTodayProgress}
        onHabitUpdate={updateProgress}
        onRemove={(templateId) => {
          eventBus.emit('habit:template-delete', { templateId });
        }}
      />

      <TemplateSelectionSheet
        isOpen={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        allTemplates={allTemplates}
        activeTemplateIds={activeTemplates.map(t => t.templateId)}
        onSelectTemplate={(templateId: string) => {
          const template = allTemplates.find(t => t.id === templateId);
          if (template) {
            eventBus.emit('habit:template-update', {
              templateId: template.id,
              habits: template.defaultHabits,
              activeDays: template.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
              customized: false,
            });
            setIsConfigOpen(false);
          }
        }}
        onCreateTemplate={handleCreateTemplate}
      />
    </div>
  );
};

export default HabitTracker;
