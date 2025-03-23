
import React from 'react';
import FeatureCards from './FeatureCards';

const FeaturesSection: React.FC = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          FlowTime combines task management, habit automation, and focused work sessions 
          in one powerful, privacy-focused application.
        </p>
      </div>
      
      <FeatureCards />
    </section>
  );
};

export default FeaturesSection;
