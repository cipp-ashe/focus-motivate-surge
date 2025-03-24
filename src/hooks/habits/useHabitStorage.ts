/**
 * Hook for managing habit storage
 */
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ActiveTemplate, HabitTemplate, ACTIVE_TEMPLATES_KEY, CUSTOM_TEMPLATES_KEY } from '@/types/habit';
import { migrateAllTemplates } from '@/lib/migrations/habitTemplates';

export function useHabitStorage() {
  const [activeTemplates, setActiveTemplates] = useLocalStorage<ActiveTemplate[]>(
    ACTIVE_TEMPLATES_KEY,
    []
  );
  
  const [customTemplates, setCustomTemplates] = useLocalStorage<HabitTemplate[]>(
    CUSTOM_TEMPLATES_KEY,
    []
  );
  
  // Function to initialize templates with migration
  const initializeTemplates = () => {
    const migratedTemplates = migrateAllTemplates(activeTemplates);
    setActiveTemplates(migratedTemplates);
  };

  // Function to add a new active template
  const addActiveTemplate = (template: ActiveTemplate) => {
    setActiveTemplates((prevTemplates) => [...prevTemplates, template]);
  };

  // Function to update an existing active template
  const updateActiveTemplate = (updatedTemplate: ActiveTemplate) => {
    setActiveTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template.templateId === updatedTemplate.templateId ? updatedTemplate : template
      )
    );
  };

  // Function to delete an active template
  const deleteActiveTemplate = (templateId: string) => {
    setActiveTemplates((prevTemplates) =>
      prevTemplates.filter((template) => template.templateId !== templateId)
    );
  };

  // Function to update the order of active templates
  const updateActiveTemplateOrder = (updatedTemplates: ActiveTemplate[]) => {
    setActiveTemplates(updatedTemplates);
  };

  // Function to add a new custom template
  const addCustomTemplate = (template: HabitTemplate) => {
    setCustomTemplates((prevTemplates) => [...prevTemplates, template]);
  };

  // Function to delete a custom template
  const deleteCustomTemplate = (templateId: string) => {
    setCustomTemplates((prevTemplates) =>
      prevTemplates.filter((template) => template.id !== templateId)
    );
  };

  return {
    activeTemplates,
    customTemplates,
    initializeTemplates,
    addActiveTemplate,
    updateActiveTemplate,
    deleteActiveTemplate,
    updateActiveTemplateOrder,
    addCustomTemplate,
    deleteCustomTemplate,
  };
}
