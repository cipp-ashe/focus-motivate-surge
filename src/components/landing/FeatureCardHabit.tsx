
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6" />
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <ArrowRight className="h-3 w-3 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button asChild variant="default" className="w-full">
          <Link to={buttonLink}>{buttonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCardHabit;
