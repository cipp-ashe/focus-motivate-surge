
import React from 'react';
import { FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEBUG_CONFIG } from '@/utils/debug';
import { debugStore } from '@/utils/debug/types';
import { EventCountCard } from '../components/EventCountCard';

interface OverviewTabProps { 
  eventCounts: {
    dataFlow: number;
    performance: number;
    state: number;
    errors: number;
    warnings: number;
    assertions: number;
    validations: number;
  }
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ eventCounts }) => {
  const exportDebugData = () => {
    const dataStr = JSON.stringify(debugStore.getEvents(), null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `debug-data-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return (
    <div className="space-y-4">
      <Card className="border border-border/30 dark:border-border/20">
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-sm font-medium">Debug Configuration</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(DEBUG_CONFIG).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-1 px-2 rounded-md bg-accent/10">
                <span className="text-xs font-medium">{key}</span>
                <Badge 
                  variant={value ? "default" : "outline"}
                  className={value ? "bg-green-500/20 hover:bg-green-500/30 text-green-700 dark:text-green-400 border-green-300/30" : ""}
                >
                  {String(value)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-border/30 dark:border-border/20">
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-sm font-medium">Event Summary</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            <EventCountCard title="Data Flow" count={eventCounts.dataFlow} icon="database" />
            <EventCountCard title="Performance" count={eventCounts.performance} icon="clock" />
            <EventCountCard title="State" count={eventCounts.state} icon="refresh" />
            <EventCountCard 
              title="Errors" 
              count={eventCounts.errors} 
              icon="alert-triangle"
              variant={eventCounts.errors > 0 ? "destructive" : "default"}
            />
            <EventCountCard 
              title="Warnings" 
              count={eventCounts.warnings} 
              icon="alert-triangle"
              variant={eventCounts.warnings > 0 ? "warning" : "default"}
            />
            <EventCountCard title="Assertions" count={eventCounts.assertions} icon="activity" />
            <EventCountCard title="Validations" count={eventCounts.validations} icon="activity" />
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={exportDebugData}>
              <FileJson className="h-3.5 w-3.5 mr-1" />
              Export Debug Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
