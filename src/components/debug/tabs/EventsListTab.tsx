
import React from 'react';
import { Database, Clock, RefreshCw, AlertTriangle, Activity } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import EventItem from '../components/EventItem';

interface EventsListTabProps {
  events: any[];
  type: 'data-flow' | 'performance' | 'state' | 'errors';
  title: string;
}

export const EventsListTab: React.FC<EventsListTabProps> = ({ events, type, title }) => {
  // Get the appropriate icon based on the type
  const getIcon = () => {
    switch (type) {
      case 'data-flow':
        return <Database className="h-4 w-4 text-blue-500" />;
      case 'performance':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'state':
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      case 'errors':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {getIcon()}
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

export default EventsListTab;
