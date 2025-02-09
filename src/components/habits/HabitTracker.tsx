import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  IconButton,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { format } from 'date-fns';

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

const HabitTracker: React.FC = () => {
  const theme = useTheme();
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
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Habit Tracker
      </Typography>

      {/* Progress Overview */}
      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Daily Progress</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ borderRadius: 8 }}
            >
              Add Habit
            </Button>
          </Box>
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
              },
            }}
          />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="body2" color="text.secondary">
              {Math.round(calculateProgress())}% Complete
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {habits.filter((h) => h.completed).length}/{habits.length} Habits
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Habit List */}
      <Grid container spacing={3}>
        {habits.map((habit) => (
          <Grid item xs={12} sm={6} md={4} key={habit.id}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" gutterBottom>
                    {habit.name}
                  </Typography>
                  <IconButton
                    color={habit.completed ? 'primary' : 'default'}
                    onClick={() => handleHabitToggle(habit.id)}
                  >
                    {habit.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {habit.description}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    size="small"
                    label={habit.category}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    icon={<LocalFireDepartmentIcon />}
                    label={`${habit.streak} day streak`}
                    color="secondary"
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    icon={<TrendingUpIcon />}
                    label={habit.timePreference}
                    variant="outlined"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Habit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Habit</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Habit Name"
              fullWidth
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={newHabit.description}
              onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
            />
            <TextField
              select
              label="Category"
              fullWidth
              value={newHabit.category}
              onChange={(e) =>
                setNewHabit({ ...newHabit, category: e.target.value as any })
              }
            >
              {['Wellness', 'Work', 'Personal', 'Learning'].map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Preferred Time"
              fullWidth
              value={newHabit.timePreference}
              onChange={(e) =>
                setNewHabit({ ...newHabit, timePreference: e.target.value as any })
              }
            >
              {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddHabit}
            disabled={!newHabit.name || !newHabit.description}
          >
            Add Habit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HabitTracker;
