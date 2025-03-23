
import React from 'react';
import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HeroHeader: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
        FlowTime combines task management, habit automation, and focused work sessions in one powerful, privacy-focused application.
      </p>
      
      <Badge variant="outline" className="mb-6">
        <Zap className="h-3.5 w-3.5 mr-1" />
        Productivity Reimagined
      </Badge>
    </div>
  );
};

export default HeroHeader;
