
import React from 'react';
import { DialogActions, Button, Box } from '@mui/material';

interface DialogFooterProps {
  onSaveAsTemplate: () => void;
  onClose: () => void;
  onSave: () => void;
}

const DialogFooter: React.FC<DialogFooterProps> = ({
  onSaveAsTemplate,
  onClose,
  onSave,
}) => {
  return (
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
        onClick={onSave}
      >
        Apply Changes
      </Button>
    </DialogActions>
  );
};

export default DialogFooter;
