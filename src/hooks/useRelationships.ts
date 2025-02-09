
import { useEffect } from "react";
import type { ActiveTemplate } from "@/components/habits/types";
import { toast } from "sonner";

export const useRelationships = (setActiveTemplates: (templates: ActiveTemplate[]) => void) => {
  useEffect(() => {
    try {
      const relations = localStorage.getItem('entity-relations');
      console.log('Loading entity relations:', relations);
      
      const handleRelationsUpdate = () => {
        console.log('Entity relations updated');
        // Handle updates to relationships here
      };

      window.addEventListener('relationsUpdated', handleRelationsUpdate);
      return () => {
        window.removeEventListener('relationsUpdated', handleRelationsUpdate);
      };
    } catch (error) {
      console.error('Error loading entity relations:', error);
      toast.error('Error loading entity relations');
    }
  }, []);

  useEffect(() => {
    const handleTemplateUpdate = () => {
      try {
        const saved = localStorage.getItem('habit-templates');
        if (saved) {
          const templates = JSON.parse(saved);
          setActiveTemplates(templates);
        }
      } catch (error) {
        console.error('Error updating templates:', error);
        toast.error('Error updating templates');
      }
    };

    window.addEventListener('templatesUpdated', handleTemplateUpdate);
    return () => {
      window.removeEventListener('templatesUpdated', handleTemplateUpdate);
    };
  }, [setActiveTemplates]);
};
