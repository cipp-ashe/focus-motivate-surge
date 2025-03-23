
import React from 'react';
import { Bug, X, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { debugStore } from '@/utils/debug/types';

interface DebugPanelHeaderProps {
  isDebugMode: boolean;
  toggleDebugMode: () => void;
  onClose: () => void;
  totalErrors: number;
  totalWarnings: number;
}

export const DebugPanelHeader: React.FC<DebugPanelHeaderProps> = ({
  isDebugMode,
  toggleDebugMode,
  onClose,
  totalErrors,
  totalWarnings
}) => {
  return (
    <div className="bg-accent/20 py-2 px-4 flex-row items-center justify-between space-y-0 flex">
      <div className="flex items-center gap-2">
        <Bug className="h-5 w-5 text-primary" />
        <CardTitle className="text-base font-medium">Debug Panel</CardTitle>
        {totalErrors > 0 && (
          <Badge variant="destructive" className="ml-2">
            {totalErrors} Error{totalErrors !== 1 ? 's' : ''}
          </Badge>
        )}
        {totalWarnings > 0 && (
          <Badge variant="outline" className="ml-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200/30">
            {totalWarnings} Warning{totalWarnings !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() => {
            debugStore.clear();
          }}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Clear
        </Button>
        <Button
          variant={isDebugMode ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs"
          onClick={toggleDebugMode}
        >
          {isDebugMode ? (
            <>
              <EyeOff className="h-3.5 w-3.5 mr-1" />
              Disable
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 mr-1" />
              Enable
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DebugPanelHeader;
