
import React, { useState } from 'react';
import { Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DebugPanel from './DebugPanel';
import { useDebug } from '@/utils/debug/logger';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

const DebugButton: React.FC = () => {
  const { isDebugMode } = useDebug();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Hide the debug button if debug mode is not enabled
  if (!isDebugMode) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={`fixed z-50 h-10 w-10 rounded-full shadow-lg bg-background border-primary/20 dark:bg-background/80 dark:border-primary/10 ${
          isMobile ? 'bottom-16 right-4' : 'bottom-4 right-4'
        }`}
        onClick={() => setIsOpen(true)}
      >
        <Bug className="h-5 w-5" />
      </Button>
      
      {isOpen && <DebugPanel onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default DebugButton;
