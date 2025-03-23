
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureCardHabitProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string;
}

const FeatureCardHabit: React.FC<FeatureCardHabitProps> = ({
  icon: Icon,
  title,
  description,
  features,
  buttonLabel,
  buttonLink,
}) => {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="h-6 w-6" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <ArrowRight className="h-3 w-3" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button asChild variant="default" className="w-full">
        <Link to={buttonLink}>{buttonLabel}</Link>
      </Button>
    </div>
  );
};

export default FeatureCardHabit;
