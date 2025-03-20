
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, TrendingUp } from 'lucide-react';
import type { Habit } from '@/types/habits';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold mb-1">{habit.name}</h3>
            <p className="text-sm text-muted-foreground">{habit.description}</p>
          </div>
          <Button
            variant={habit.completed ? "default" : "outline"}
            size="icon"
            onClick={() => onToggle(habit.id)}
          >
            <Check className={`h-4 w-4 ${habit.completed ? "" : "text-muted-foreground"}`} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-auto">
          <Badge variant="outline" className="text-xs">
            {habit.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {habit.streak} day streak
          </Badge>
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="mr-1 h-3 w-3" />
            {habit.timePreference}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
