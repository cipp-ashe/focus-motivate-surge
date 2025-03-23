
import React from 'react';
import FeatureCardsHabit from './FeatureCardsHabit';

const FeaturesSection: React.FC = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">Everything You Need</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">FlowTime combines task management, habit automation, and focused work sessions in one powerful, privacy-focused application.</p>
      </div>
      
      <FeatureCardsHabit />
    </section>
  );
};

export default FeaturesSection;
