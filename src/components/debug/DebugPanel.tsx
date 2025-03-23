
import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  X, 
  AlertTriangle, 
  Activity, 
  Database, 
  Clock, 
  RefreshCw,
  Eye,
  EyeOff,
  FileJson
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebug, debugStore, DEBUG_CONFIG, IS_DEV } from '@/utils/debug';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Debug panel component for displaying debug information and controls
 */
const DebugPanel: React.FC = () => {
  const { isDebugMode, toggleDebugMode } = useDebug();
  const [isOpen, setIsOpen] = useState(false);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Load debug events
  useEffect(() => {
    if (isOpen) {
      setActiveEvents(debugStore.getEvents());

      // Refresh debug events every second when panel is open
      const interval = setInterval(() => {
        setActiveEvents(debugStore.getEvents());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

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

  const totalErrors = activeEvents.filter(e => e.type === 'error').length;
  const totalWarnings = activeEvents.filter(e => 
    e.type === 'warning' || e.type === 'assertion' || e.type === 'validation'
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-border/30 dark:border-border/20 shadow-lg">
        <CardHeader className="bg-accent/20 py-2 px-4 flex-row items-center justify-between space-y-0">
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
                setActiveEvents([]);
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
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid grid-cols-5 gap-2 px-4 py-2 bg-background">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data-flow">
              Data Flow
              <Badge variant="outline" className="ml-1 h-5 text-[10px]">
                {activeEvents.filter(e => e.type === 'data-flow').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="performance">
              Performance
              <Badge variant="outline" className="ml-1 h-5 text-[10px]">
                {activeEvents.filter(e => e.type === 'performance').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="state">
              State
              <Badge variant="outline" className="ml-1 h-5 text-[10px]">
                {activeEvents.filter(e => e.type === 'state-change').length}
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
              <OverviewTab 
                debugConfig={DEBUG_CONFIG} 
                eventCounts={{
                  dataFlow: activeEvents.filter(e => e.type === 'data-flow').length,
                  performance: activeEvents.filter(e => e.type === 'performance').length,
                  state: activeEvents.filter(e => e.type === 'state-change').length,
                  errors: totalErrors,
                  warnings: totalWarnings,
                  assertions: activeEvents.filter(e => e.type === 'assertion').length,
                  validations: activeEvents.filter(e => e.type === 'validation').length,
                }}
              />
            </TabsContent>
            
            <TabsContent value="data-flow" className="h-full">
              <EventsList 
                events={activeEvents.filter(e => e.type === 'data-flow')}
                icon={<Database className="h-4 w-4 text-blue-500" />}
                title="Data Flow Events"
              />
            </TabsContent>
            
            <TabsContent value="performance" className="h-full">
              <EventsList 
                events={activeEvents.filter(e => e.type === 'performance')}
                icon={<Clock className="h-4 w-4 text-green-500" />}
                title="Performance Measurements"
              />
            </TabsContent>
            
            <TabsContent value="state" className="h-full">
              <EventsList 
                events={activeEvents.filter(e => e.type === 'state-change')}
                icon={<RefreshCw className="h-4 w-4 text-purple-500" />}
                title="State Changes"
              />
            </TabsContent>
            
            <TabsContent value="errors" className="h-full">
              <EventsList 
                events={activeEvents.filter(e => 
                  e.type === 'error' || 
                  e.type === 'warning' || 
                  e.type === 'assertion' || 
                  e.type === 'validation'
                )}
                icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
                title="Issues & Warnings"
              />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

const OverviewTab: React.FC<{ 
  debugConfig: typeof DEBUG_CONFIG,
  eventCounts: {
    dataFlow: number;
    performance: number;
    state: number;
    errors: number;
    warnings: number;
    assertions: number;
    validations: number;
  }
}> = ({ debugConfig, eventCounts }) => {
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
            {Object.entries(debugConfig).map(([key, value]) => (
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
            <EventCountCard title="Data Flow" count={eventCounts.dataFlow} icon={<Database className="h-3 w-3" />} />
            <EventCountCard title="Performance" count={eventCounts.performance} icon={<Clock className="h-3 w-3" />} />
            <EventCountCard title="State" count={eventCounts.state} icon={<RefreshCw className="h-3 w-3" />} />
            <EventCountCard 
              title="Errors" 
              count={eventCounts.errors} 
              icon={<AlertTriangle className="h-3 w-3" />}
              variant={eventCounts.errors > 0 ? "destructive" : "default"}
            />
            <EventCountCard 
              title="Warnings" 
              count={eventCounts.warnings} 
              icon={<AlertTriangle className="h-3 w-3" />}
              variant={eventCounts.warnings > 0 ? "warning" : "default"}
            />
            <EventCountCard title="Assertions" count={eventCounts.assertions} icon={<Activity className="h-3 w-3" />} />
            <EventCountCard title="Validations" count={eventCounts.validations} icon={<Activity className="h-3 w-3" />} />
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

const EventCountCard: React.FC<{
  title: string;
  count: number;
  icon: React.ReactNode;
  variant?: 'default' | 'destructive' | 'warning';
}> = ({ title, count, icon, variant = 'default' }) => {
  const baseClasses = "flex flex-col items-center justify-center p-2 rounded-md";
  
  let variantClasses = "bg-accent/10";
  if (variant === 'destructive') {
    variantClasses = "bg-destructive/10 text-destructive dark:bg-destructive/20";
  } else if (variant === 'warning') {
    variantClasses = "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200/30";
  }
  
  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <div className="flex items-center gap-1 text-xs font-medium">
        {icon}
        <span>{title}</span>
      </div>
      <span className="text-xl font-bold">{count}</span>
    </div>
  );
};

const EventsList: React.FC<{
  events: any[];
  icon: React.ReactNode;
  title: string;
}> = ({ events, icon, title }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
        <Badge variant="outline" className="ml-auto">
          {events.length} event{events.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <Separator className="my-2" />
      
      {events.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          <p>No events recorded</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {events.map((event, index) => (
            <EventItem key={index} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

const EventItem: React.FC<{ event: any }> = ({ event }) => {
  const [expanded, setExpanded] = useState(false);
  
  let typeColor = "";
  let typeIcon = null;
  
  switch (event.type) {
    case 'error':
      typeColor = "text-destructive";
      typeIcon = <AlertTriangle className="h-4 w-4 text-destructive" />;
      break;
    case 'warning':
    case 'assertion':
    case 'validation':
      typeColor = "text-yellow-500";
      typeIcon = <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      break;
    case 'data-flow':
      typeColor = "text-blue-500";
      typeIcon = <Database className="h-4 w-4 text-blue-500" />;
      break;
    case 'performance':
      typeColor = "text-green-500";
      typeIcon = <Clock className="h-4 w-4 text-green-500" />;
      break;
    case 'state-change':
      typeColor = "text-purple-500";
      typeIcon = <RefreshCw className="h-4 w-4 text-purple-500" />;
      break;
    default:
      typeColor = "text-foreground";
      typeIcon = <Activity className="h-4 w-4" />;
  }
  
  const eventTime = new Date(event.timestamp).toLocaleTimeString();
  
  return (
    <div 
      className={`
        rounded-md border border-border/30 dark:border-border/20 p-2 cursor-pointer hover:bg-accent/5
        ${expanded ? 'bg-accent/10' : 'bg-background'}
      `}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2">
        {typeIcon}
        <span className={`text-xs font-medium ${typeColor}`}>
          {event.module}:{event.component}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">{eventTime}</span>
      </div>
      
      <div className="mt-1 text-sm">{event.message}</div>
      
      {expanded && event.data && (
        <div className="mt-2 pt-2 border-t border-border/20 dark:border-border/10">
          <pre className="text-xs overflow-auto bg-accent/5 p-2 rounded max-h-40">
            {JSON.stringify(event.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
