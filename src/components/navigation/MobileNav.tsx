
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Menu, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { NAV_CATEGORIES } from './navigationConfig';
import { useNavigation } from '@/hooks/ui/useNavigation';
import { NavigationLinkItem } from './NavigationLinkItem';

export const MobileNav: React.FC = () => {
  const { isActive } = useNavigation();
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  
  const toggleSubMenu = (category: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="md:hidden">
      <DropdownMenu open={isMainMenuOpen} onOpenChange={setIsMainMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side="bottom" 
          align="end" 
          className="w-64 mt-2 z-50 bg-background border border-border/40"
        >
          <DropdownMenuItem asChild>
            <NavigationLinkItem 
              to="/"
              icon={Home}
              label="Home"
              isActive={isActive('/')}
              showLabel={true}
              className="flex w-full justify-start px-2 py-2"
              onClick={() => setIsMainMenuOpen(false)}
            />
          </DropdownMenuItem>
          
          {/* Category submenus */}
          {Object.entries(NAV_CATEGORIES).map(([key, category]) => (
            <div key={key} className="w-full">
              <DropdownMenuItem 
                className="flex items-center justify-between w-full px-2 py-2"
                onClick={() => toggleSubMenu(key)}
              >
                <div className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  <span>{category.label}</span>
                </div>
                
                {openSubMenus[key] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              
              {openSubMenus[key] && (
                <div className="ml-4 pl-2 border-l border-border/20 my-1">
                  {category.items.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1 rounded-md transition-colors",
                          isActive(item.path) 
                            ? "text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => setIsMainMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
