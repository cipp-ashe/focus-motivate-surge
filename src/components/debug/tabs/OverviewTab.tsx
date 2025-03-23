
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { EventCountCard } from '../components/EventCountCard';

interface OverviewTabProps {
  eventCounts: Record<string, number>;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ eventCounts }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Event Count Summary</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <EventCountCard 
          title="Data Flows" 
          count={eventCounts.dataFlow || 0}
          icon="database"
        />
        <EventCountCard 
          title="Performance" 
          count={eventCounts.performance || 0}
          icon="clock"
        />
        <EventCountCard 
          title="State Changes" 
          count={eventCounts.state || 0}
          icon="refresh"
        />
        <EventCountCard 
          title="Errors" 
          count={eventCounts.errors || 0}
          icon="alert-triangle"
          variant={eventCounts.errors > 0 ? "destructive" : "default"}
        />
      </div>
      
      <Card className="mt-4 border border-border/30">
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-sm">Debug Status</CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-xs space-y-2">
          <p>Debug mode is active and monitoring application events.</p>
          <p className="text-muted-foreground">
            The debugger captures data flow events, performance metrics, state changes, and errors.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
