import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { HabitTemplate } from '../../types';

export interface CustomTemplatesProps {
  templates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelect: (template: HabitTemplate) => void;
}

const CustomTemplates: React.FC<CustomTemplatesProps> = ({
  templates,
  activeTemplateIds,
  onSelect,
}) => {
  if (templates.length === 0) {
    return (
      <Box sx={{ mt: 2, p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No custom templates yet. Create your first template to see it here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <List>
        {templates.map((template) => (
          <ListItem
            key={template.id}
            sx={{
              bgcolor: 'background.paper',
              mb: 1,
              borderRadius: 1,
            }}
          >
            <ListItemText
              primary={template.name}
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    {template.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {template.category} • {template.defaultHabits.length} habits
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => onSelect(template)}
                disabled={activeTemplateIds.includes(template.id)}
              >
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CustomTemplates;
