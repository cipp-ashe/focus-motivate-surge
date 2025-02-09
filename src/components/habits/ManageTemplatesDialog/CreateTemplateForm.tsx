import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Stack,
} from '@mui/material';
import { DAYS_OF_WEEK, DEFAULT_ACTIVE_DAYS, DayOfWeek, NewTemplate } from '../../types';

interface CreateTemplateFormProps {
  onSubmit: (template: NewTemplate) => void;
  onCancel: () => void;
}

const CreateTemplateForm: React.FC<CreateTemplateFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [activeDays, setActiveDays] = useState<DayOfWeek[]>(DEFAULT_ACTIVE_DAYS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      category,
      defaultHabits: [],
      defaultDays: activeDays,
    });
  };

  const handleDayToggle = (day: DayOfWeek) => {
    setActiveDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          required
        />
        <TextField
          fullWidth
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <FormControl component="fieldset">
          <FormLabel component="legend">Active Days</FormLabel>
          <FormGroup row>
            {DAYS_OF_WEEK.map((day) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={activeDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!name || !description || !category || activeDays.length === 0}
          >
            Create Template
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default CreateTemplateForm;
