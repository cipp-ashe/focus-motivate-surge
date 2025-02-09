import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { HabitDetail, DayOfWeek, DAYS_OF_WEEK } from './types';
import { habitTemplates } from '../../utils/habitTemplates';

interface ConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (habits: HabitDetail[]) => void;
  onSaveAsTemplate: () => void;
  habits: HabitDetail[];
  activeDays?: DayOfWeek[];
  onUpdateDays?: (days: DayOfWeek[]) => void;
}

const ConfigurationDialog: React.FC<ConfigurationDialogProps> = ({
  open,
  onClose,
  onSave,
  onSaveAsTemplate,
  habits: initialHabits,
  activeDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  onUpdateDays = () => {},
}) => {
  const [habits, setHabits] = useState<HabitDetail[]>(initialHabits);

  const [currentDays, setCurrentDays] = useState<DayOfWeek[]>(activeDays);
  
  const handleAddHabit = () => {
    const newHabit: HabitDetail = {
      id: `habit-${Date.now()}`,
      name: 'New Habit',
      description: '',
      category: 'Personal',
      timePreference: 'Anytime',
      metrics: { type: 'boolean' },
      insights: [],
      tips: [],
    };
    setHabits([...habits, newHabit]);
  };

  const handleUpdateHabit = (index: number, updates: Partial<HabitDetail>) => {
    const updatedHabits = [...habits];
    updatedHabits[index] = {
      ...updatedHabits[index],
      ...updates,
    };
    setHabits(updatedHabits);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(habits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setHabits(items);
  };

  const handleDayToggle = (day: DayOfWeek) => {
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    // Ensure at least one day is selected
    if (updatedDays.length > 0) {
      setCurrentDays(updatedDays);
      onUpdateDays(updatedDays);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Configure Template</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Active Days
          </Typography>
          <Stack direction="row" spacing={1}>
            {DAYS_OF_WEEK.map((day) => (
              <Button
                key={day}
                variant={currentDays.includes(day) ? "contained" : "outlined"}
                size="small"
                onClick={() => handleDayToggle(day)}
                sx={{
                  minWidth: 40,
                  height: 32,
                }}
              >
                {day.slice(0, 1)}
              </Button>
            ))}
          </Stack>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Configure Habits
        </Typography>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="habits">
            {(provided) => (
              <Stack spacing={3} sx={{ mt: 1 }} ref={provided.innerRef} {...provided.droppableProps}>
                {habits.map((habit, index) => (
                  <Draggable key={habit.id} draggableId={habit.id} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box {...provided.dragHandleProps} sx={{ mr: 1, cursor: 'grab' }}>
                            <DragIndicatorIcon />
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Habit Name"
                                value={habit.name}
                                onChange={(e) => handleUpdateHabit(index, { name: e.target.value })}
                                sx={{ mb: 2 }}
                              />
                              <TextField
                                fullWidth
                                label="Tracking Type"
                                select
                                value={habit.metrics.type}
                                onChange={(e) => {
                                  const type = e.target.value as 'boolean' | 'duration' | 'count' | 'rating';
                                  handleUpdateHabit(index, {
                                    metrics: {
                                      type,
                                      ...(type === 'duration' && { unit: 'minutes', min: 5, target: 30 }),
                                      ...(type === 'count' && { target: 1 }),
                                      ...(type === 'rating' && { min: 1, max: 5 }),
                                    },
                                  });
                                }}
                              >
                                <MenuItem value="boolean">Checkbox</MenuItem>
                                <MenuItem value="duration">Duration</MenuItem>
                                <MenuItem value="count">Counter</MenuItem>
                                <MenuItem value="rating">Rating</MenuItem>
                              </TextField>
                            </Grid>
                            {habit.metrics.type !== 'boolean' && (
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Target Value"
                                  type="number"
                                  value={habit.metrics.target || ''}
                                  onChange={(e) => handleUpdateHabit(index, {
                                    metrics: {
                                      ...habit.metrics,
                                      target: parseInt(e.target.value),
                                    },
                                  })}
                                />
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      </DialogContent>
      <Box sx={{ px: 3, pb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddHabit}
        >
          Add Habit
        </Button>
      </Box>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onSaveAsTemplate}
        >
          Save as Custom Template
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(habits)}
        >
          Apply Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigurationDialog;
