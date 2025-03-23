
import React, { useState } from 'react';
import { AlertTriangle, Database, Clock, RefreshCw, Activity } from 'lucide-react';

interface EventItemProps {
  event: any;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
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

export default EventItem;
