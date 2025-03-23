
import React from 'react';
import { Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { IS_DEV } from '@/utils/debug';
import DebugPanelHeader from './components/DebugPanelHeader';
import OverviewTab from './tabs/OverviewTab';
import EventsListTab from './tabs/EventsListTab';
import useDebugPanel from './hooks/useDebugPanel';

/**
 * Debug panel component for displaying debug information and controls
 */
const DebugPanel: React.FC = () => {
  const {
    isDebugMode,
    toggleDebugMode,
    isOpen,
    setIsOpen,
    activeEvents,
    activeTab,
    setActiveTab,
    eventCounts,
    totalErrors,
    totalWarnings
  } = useDebugPanel();

  if (!IS_DEV && !isDebugMode) {
    return null;
  }

  // If panel is closed, just show the toggle button
  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full shadow-lg bg-background border-primary/20 dark:bg-background/80 dark:border-primary/10"
        onClick={() => setIsOpen(true)}
      >
        <Bug className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-border/30 dark:border-border/20 shadow-lg">
        <CardHeader className="p-0 space-y-0">
          <DebugPanelHeader
            isDebugMode={isDebugMode}
            toggleDebugMode={toggleDebugMode}
            onClose={() => setIsOpen(false)}
            totalErrors={totalErrors}
            totalWarnings={totalWarnings}
          />
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid grid-cols-5 gap-2 px-4 py-2 bg-background">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data-flow">
              Data Flow
              <Badge variant="outline" className="ml-1 h-5 text-[10px]">
                {eventCounts.dataFlow}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="performance">
              Performance
              <Badge variant="outline" className="ml-1 h-5 text-[10px]">
                {eventCounts.performance}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="state">
              State
              <Badge variant="outline" className="ml-1 h-5 text-[10px]">
                {eventCounts.state}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="errors">
              Issues
              <Badge variant={totalErrors + totalWarnings > 0 ? "destructive" : "outline"} className="ml-1 h-5 text-[10px]">
                {totalErrors + totalWarnings}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-auto p-4">
            <TabsContent value="overview" className="h-full">
              <OverviewTab eventCounts={eventCounts} />
            </TabsContent>
            
            <TabsContent value="data-flow" className="h-full">
              <EventsListTab 
                events={activeEvents.filter(e => e.type === 'data-flow')}
                type="data-flow"
                title="Data Flow Events"
              />
            </TabsContent>
            
            <TabsContent value="performance" className="h-full">
              <EventsListTab 
                events={activeEvents.filter(e => e.type === 'performance')}
                type="performance"
                title="Performance Measurements"
              />
            </TabsContent>
            
            <TabsContent value="state" className="h-full">
              <EventsListTab 
                events={activeEvents.filter(e => e.type === 'state-change')}
                type="state"
                title="State Changes"
              />
            </TabsContent>
            
            <TabsContent value="errors" className="h-full">
              <EventsListTab 
                events={activeEvents.filter(e => 
                  e.type === 'error' || 
                  e.type === 'warning' || 
                  e.type === 'assertion' || 
                  e.type === 'validation'
                )}
                type="errors"
                title="Issues & Warnings"
              />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default DebugPanel;
