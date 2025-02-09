import React from 'react';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import { DAYS_OF_WEEK, DayOfWeek } from '../../types';

interface DaySelectorProps {
  activeDays: DayOfWeek[];
  onUpdateDays: (days: DayOfWeek[]) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  activeDays,
  onUpdateDays,
}) => {
  const handleDayToggle = (day: DayOfWeek) => {
    const newDays = activeDays.includes(day)
      ? activeDays.filter(d => d !== day)
      : [...activeDays, day];
    onUpdateDays(newDays);
  };

  const handleKeyPress = (event: React.KeyboardEvent, day: DayOfWeek) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDayToggle(day);
    }
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" id="active-days-label">
        Active Days
      </FormLabel>
      <FormGroup row>
        {DAYS_OF_WEEK.map((day) => (
          <Box
            key={day}
            sx={{
              '& .MuiFormControlLabel-root': {
                mr: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                },
              },
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeDays.includes(day)}
                  onChange={() => handleDayToggle(day)}
                  onKeyPress={(e) => handleKeyPress(e, day)}
                  inputProps={{
                    'aria-label': `Toggle ${day}`,
                    'aria-describedby': 'active-days-label',
                  }}
                />
              }
              label={day}
            />
          </Box>
        ))}
      </FormGroup>
    </FormControl>
  );
};

export default DaySelector;
