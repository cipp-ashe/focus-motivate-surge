
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ElementType;
  iconClass: string;
  iconColor: string;
  title: string;
  description: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string;
  cardClass: string;
  iconBgClass: string;
  iconFeatureClass: string;
  iconFeatureColor: string;
  buttonStyle: React.CSSProperties;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  iconClass,
  iconColor,
  title,
  description,
  features,
  buttonLabel,
  buttonLink,
  cardClass,
  iconBgClass,
  iconFeatureClass,
  iconFeatureColor,
  buttonStyle
}) => {
  return (
    <Card className={`border-border/30 dark:border-border/5 bg-gradient-to-br ${cardClass} to-transparent shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm focus:outline-none`}>
      <CardHeader className="focus:outline-none focus-visible:outline-none">
        <div className="flex items-center gap-3 mb-1">
          <div className={`p-2 rounded-md ${iconBgClass}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <CardTitle className="focus:outline-none focus-visible:outline-none">{title}</CardTitle>
        </div>
        <CardDescription className="text-left mt-2 focus:outline-none focus-visible:outline-none">{description}</CardDescription>
      </CardHeader>
      <CardContent className="focus:outline-none focus-visible:outline-none">
        <ul className="space-y-2 mb-4 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 focus:outline-none focus-visible:outline-none">
              <div className={`h-5 w-5 rounded-full ${iconFeatureClass} flex items-center justify-center`}>
                <ArrowRight className={`h-3 w-3 ${iconFeatureColor}`} />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="focus:outline-none focus-visible:outline-none">
        <Button asChild className="w-full button-glow focus:outline-none focus-visible:outline-none" variant="default" style={buttonStyle}>
          <Link to={buttonLink} className="focus:outline-none focus-visible:outline-none">{buttonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
