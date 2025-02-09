
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Check, Plus, TrendingUp } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import type { Habit } from '@/types/habits';

export const HabitTracker: React.FC = () => {
  const { habits, addHabit, toggleHabit } = useHabits();
  const [openDialog, setOpenDialog] = useState(false);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    name: '',
    description: '',
    category: 'Personal',
    timePreference: 'Anytime',
  });

  const calculateProgress = () => {
    if (habits.length === 0) return 0;
    return (habits.filter((h) => h.completed).length / habits.length) * 100;
  };

  const handleAddHabit = () => {
    if (newHabit.name && newHabit.description && newHabit.category && newHabit.timePreference) {
      addHabit(newHabit as Required<Omit<Habit, 'id' | 'completed' | 'streak' | 'lastCompleted'>>);
      setOpenDialog(false);
      setNewHabit({
        name: '',
        description: '',
        category: 'Personal',
        timePreference: 'Anytime',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Daily Progress</h2>
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Habit
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Progress value={calculateProgress()} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{Math.round(calculateProgress())}% Complete</span>
              <span>{habits.filter((h) => h.completed).length}/{habits.length} Habits</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <Card key={habit.id} className="overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold mb-1">{habit.name}</h3>
                  <p className="text-sm text-muted-foreground">{habit.description}</p>
                </div>
                <Button
                  variant={habit.completed ? "default" : "outline"}
                  size="icon"
                  onClick={() => toggleHabit(habit.id)}
                >
                  <Check className={`h-4 w-4 ${habit.completed ? "" : "text-muted-foreground"}`} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
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
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>
              Create a new habit to track. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Habit Name"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Description"
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Select
                  value={newHabit.category}
                  onValueChange={(value) => setNewHabit({ ...newHabit, category: value as Habit['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Wellness', 'Work', 'Personal', 'Learning'].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Select
                  value={newHabit.timePreference}
                  onValueChange={(value) => setNewHabit({ ...newHabit, timePreference: value as Habit['timePreference'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Preferred Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHabit} disabled={!newHabit.name || !newHabit.description}>
              Add Habit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

