
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { HabitList } from './HabitList';
import { HabitForm } from './HabitForm';
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Daily Progress</h2>
        <Button onClick={() => setOpenDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

      <HabitList habits={habits} onToggle={toggleHabit} />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <HabitForm
          newHabit={newHabit}
          onHabitChange={(updates) => setNewHabit({ ...newHabit, ...updates })}
          onSubmit={handleAddHabit}
          onCancel={() => setOpenDialog(false)}
        />
      </Dialog>
    </div>
  );
};
