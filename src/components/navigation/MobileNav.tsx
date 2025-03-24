
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { NAV_CATEGORIES } from './navigationConfig';
import { useNavigation } from '@/hooks/ui/useNavigation';
import { NavigationLinkItem } from './NavigationLinkItem';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const MobileNav: React.FC = () => {
  const { openCategory, toggleCategory, isActive, isInCategory } = useNavigation();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-[300px] sm:max-w-sm bg-background/90 backdrop-blur-md">
        <div className="flex flex-col space-y-5 mt-8">
          <NavigationLinkItem 
            to="/"
            icon={Home}
            label="Home"
            isActive={isActive('/')}
            showLabel={true}
            className="flex w-full justify-start px-2 py-2 text-lg"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Category dropdowns for mobile */}
          {Object.entries(NAV_CATEGORIES).map(([key, category]) => (
            <div key={key} className="w-full">
              <Collapsible className="w-full">
                <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-2">
                  <div className="flex items-center text-lg font-medium gap-2">
                    <category.icon className="h-5 w-5" />
                    <span>{category.label}</span>
                  </div>
                  {openCategory === key as any ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-6 mt-2 space-y-3">
                    {category.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1 rounded-md transition-colors",
                          isActive(item.path) 
                            ? "text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
