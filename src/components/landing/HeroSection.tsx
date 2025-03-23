
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="mb-10">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">FlowTime App</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          A productivity tool that helps you manage tasks, track time, and build habits.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/tasks">
              <Zap className="mr-2 h-5 w-5" />
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
