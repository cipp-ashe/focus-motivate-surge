
import React from 'react';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HabitExampleCardProps {
  icon: React.ElementType;
  title: string;
  badgeType: string;
  timeBadge: string;
  timeIcon?: React.ElementType;
  tags: string;
  description: string;
}

const HabitExampleCard: React.FC<HabitExampleCardProps> = ({
  icon: Icon,
  title,
  badgeType,
  timeBadge,
  timeIcon: TimeIcon,
  tags,
  description
}) => {
  return (
    <div className="border rounded-lg p-5">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="h-5 w-5" />
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline">{badgeType}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {TimeIcon && <TimeIcon className="h-3 w-3" />} {timeBadge}
            </Badge>
          </div>
        </div>
      </div>
      <div className="pl-12 ml-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Tag className="h-3.5 w-3.5" />
          <span>{tags}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default HabitExampleCard;
