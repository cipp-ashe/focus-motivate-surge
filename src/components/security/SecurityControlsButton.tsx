
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SecurityControlsButton: React.FC = () => {
  return (
    <Button variant="outline" asChild>
      <Link to="/security-controls" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        <span>Security Controls</span>
      </Link>
    </Button>
  );
};
