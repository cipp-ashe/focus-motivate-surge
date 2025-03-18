
import React from 'react';
import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HeroHeader: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">Everything You Need</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
        FlowTime combines task management, habit automation, and focused work sessions in one powerful, privacy-focused application.
      </p>
      
      <Badge variant="outline" className="mb-6 px-3 py-1 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
        <Zap className="h-3.5 w-3.5 mr-1" />
        Productivity Reimagined
      </Badge>
    </div>
  );
};

export default HeroHeader;
