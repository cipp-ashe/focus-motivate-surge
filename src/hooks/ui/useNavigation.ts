
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export type NavCategory = 'tasks' | 'notes' | 'settings' | null;

export const useNavigation = () => {
  const location = useLocation();
  const [openCategory, setOpenCategory] = useState<NavCategory>(null);
  
  const toggleCategory = (category: NavCategory) => {
    setOpenCategory(openCategory === category ? null : category);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const isInCategory = (category: string, paths: string[]) => {
    return paths.some(path => location.pathname === path);
  };
  
  return {
    openCategory,
    toggleCategory,
    isActive,
    isInCategory
  };
};
