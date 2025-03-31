
import React from 'react';
import { useLocation } from 'react-router-dom';
import { NAV_CATEGORIES } from './navigationConfig';
import { NavigationDropdown } from './NavigationDropdown';
import { useNavigation } from '@/hooks/ui/useNavigation';
import { NavigationLinkItem } from './NavigationLinkItem';
import { Home } from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const location = useLocation();
  const { openCategory, toggleCategory, isActive, isInCategory } = useNavigation();
  
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <NavigationLinkItem 
        to="/"
        icon={Home}
        label="Home"
        isActive={isActive('/')}
        className="font-medium dark:text-slate-300 dark:hover:text-white"
      />
      
      {/* Dynamic category dropdowns with improved z-index handling */}
      {Object.entries(NAV_CATEGORIES).map(([key, category]) => (
        <NavigationDropdown
          key={key}
          category={key}
          icon={category.icon}
          label={category.label}
          items={category.items}
          isOpen={openCategory === key as any}
          isActive={isInCategory(key, category.paths)}
          onToggle={() => toggleCategory(key as any)}
          isActiveItem={isActive}
          showLabel={true}
          position="top"
          className="font-medium dark:text-slate-300 dark:hover:text-white"
        />
      ))}
    </nav>
  );
};
