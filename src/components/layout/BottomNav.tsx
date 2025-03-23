
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/hooks/ui/useNavigation';
import { NavigationLinkItem } from '@/components/navigation/NavigationLinkItem';
import { NavigationDropdown } from '@/components/navigation/NavigationDropdown';
import { NAV_CATEGORIES } from '@/components/navigation/navigationConfig';

export const BottomNav = () => {
  const { openCategory, toggleCategory, isActive, isInCategory } = useNavigation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/40 p-2 z-50 md:hidden" 
      style={{ 
        backgroundColor: 'hsl(var(--background))',
        outline: 'none', 
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
      <div className="flex items-center justify-between">
        {/* Home Button */}
        <NavigationLinkItem
          to="/"
          icon={Home}
          label="Home"
          isActive={isActive('/')}
          className="flex flex-col items-center p-2 rounded-md transition-colors"
        />
        
        {/* Tasks Category */}
        <NavigationDropdown
          category="tasks"
          icon={NAV_CATEGORIES.tasks.icon}
          label={NAV_CATEGORIES.tasks.label}
          items={NAV_CATEGORIES.tasks.items}
          isOpen={openCategory === 'tasks'}
          isActive={openCategory === 'tasks' || isInCategory('tasks', NAV_CATEGORIES.tasks.paths)}
          onToggle={() => toggleCategory('tasks')}
          isActiveItem={isActive}
          position="bottom"
          className="flex flex-col items-center p-2 rounded-md transition-colors"
        />
        
        {/* Notes Category */}
        <NavigationDropdown
          category="notes"
          icon={NAV_CATEGORIES.notes.icon}
          label={NAV_CATEGORIES.notes.label}
          items={NAV_CATEGORIES.notes.items}
          isOpen={openCategory === 'notes'}
          isActive={openCategory === 'notes' || isInCategory('notes', NAV_CATEGORIES.notes.paths)}
          onToggle={() => toggleCategory('notes')}
          isActiveItem={isActive}
          position="bottom"
          className="flex flex-col items-center p-2 rounded-md transition-colors"
        />
        
        {/* Settings Category */}
        <NavigationDropdown
          category="settings"
          icon={NAV_CATEGORIES.settings.icon}
          label={NAV_CATEGORIES.settings.label}
          items={NAV_CATEGORIES.settings.items}
          isOpen={openCategory === 'settings'}
          isActive={openCategory === 'settings' || isInCategory('settings', NAV_CATEGORIES.settings.paths)}
          onToggle={() => toggleCategory('settings')}
          isActiveItem={isActive}
          position="bottom"
          className="flex flex-col items-center p-2 rounded-md transition-colors"
        />
      </div>
    </nav>
  );
};
