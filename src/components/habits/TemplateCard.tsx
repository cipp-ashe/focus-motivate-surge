import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { HabitDetail, HabitTemplate } from './types';
import HabitMetric from './HabitMetric';

interface ProgressResult {
  value: boolean | number;
  streak: number;
}

interface TemplateCardProps {
  template: {
    templateId: string;
    habits: HabitDetail[];
    activeDays: string[];
  };
  templateInfo: HabitTemplate;
  onCustomize: () => void;
  onRemove: () => void;
  getProgress: (habitId: string, templateId: string) => ProgressResult;
  onHabitUpdate: (habitId: string, value: boolean | number) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  templateInfo,
  onCustomize,
  onRemove,
  getProgress,
  onHabitUpdate,
}) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            {templateInfo.name}
          </Typography>
          <Box>
            <IconButton size="small" onClick={onCustomize}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={onRemove}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          {template.habits.map((habit) => (
            <Grid item xs={12} sm={6} md={4} key={habit.id}>
              <HabitMetric
                habit={habit}
                progress={getProgress(habit.id, template.templateId)}
                onUpdate={(value) => onHabitUpdate(habit.id, value)}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
