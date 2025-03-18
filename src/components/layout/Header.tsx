
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/hooks/ui/useNavigation';
import { NavigationLinkItem } from '@/components/navigation/NavigationLinkItem';
import { NavigationDropdown } from '@/components/navigation/NavigationDropdown';
import { NAV_CATEGORIES } from '@/components/navigation/navigationConfig';

export const Header = () => {
  const { openCategory, toggleCategory, isActive, isInCategory } = useNavigation();
  const isMobile = useIsMobile(1024);
  
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className={`text-xl font-bold flex items-center ${isMobile ? 'gap-1' : 'gap-2'} text-primary`}>
            <Clock className="h-5 w-5" />
            {!isMobile && <span>TaskTimer</span>}
          </Link>
        </div>
        
        <nav className="flex items-center space-x-4 md:space-x-6">
          {/* Home Link */}
          <NavigationLinkItem
            to="/"
            icon={Home}
            label="Home"
            isActive={isActive('/')}
            showLabel={!isMobile}
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
            showLabel={!isMobile}
            position="top"
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
            showLabel={!isMobile}
            position="top"
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
            showLabel={!isMobile}
            position="top"
          />
        </nav>
      </div>
    </header>
  );
};
