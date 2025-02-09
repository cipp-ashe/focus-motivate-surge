
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Check, Plus, TrendingUp, FlameIcon } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'Wellness' | 'Work' | 'Personal' | 'Learning';
  timePreference: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
  completed: boolean;
  streak: number;
  lastCompleted: Date | null;
}

export const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning Meditation',
      description: 'Start the day with 10 minutes of mindfulness',
      category: 'Wellness',
      timePreference: 'Morning',
      completed: false,
      streak: 5,
      lastCompleted: new Date(),
    },
    {
      id: '2',
      name: 'Deep Work Block',
      description: '90 minutes of focused work',
      category: 'Work',
      timePreference: 'Morning',
      completed: false,
      streak: 3,
      lastCompleted: null,
    },
  ]);

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

  const handleHabitToggle = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              completed: !habit.completed,
              streak: habit.completed ? habit.streak - 1 : habit.streak + 1,
              lastCompleted: habit.completed ? null : new Date(),
            }
          : habit
      )
    );
    toast.success("Habit status updated!");
  };

  const handleAddHabit = () => {
    if (newHabit.name && newHabit.description) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit.name,
        description: newHabit.description,
        category: newHabit.category as 'Personal',
        timePreference: newHabit.timePreference as 'Anytime',
        completed: false,
        streak: 0,
        lastCompleted: null,
      };
      setHabits((prev) => [...prev, habit]);
      setOpenDialog(false);
      setNewHabit({
        name: '',
        description: '',
        category: 'Personal',
        timePreference: 'Anytime',
      });
      toast.success("New habit created!");
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
                  onClick={() => handleHabitToggle(habit.id)}
                >
                  <Check className={`h-4 w-4 ${habit.completed ? "" : "text-muted-foreground"}`} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {habit.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <FlameIcon className="mr-1 h-3 w-3" />
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
                  onValueChange={(value) => setNewHabit({ ...newHabit, category: value as any })}
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
                  onValueChange={(value) => setNewHabit({ ...newHabit, timePreference: value as any })}
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
