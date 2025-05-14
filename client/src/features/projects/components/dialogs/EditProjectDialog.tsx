import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
} from "@mui/material";

/**
 * Props interface for EditProjectDialog component
 */
interface EditProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, description?: string) => void;
  initialName: string;
  initialDescription?: string;
  error?: string | null;
}

/**
 * Dialog component for editing existing projects
 * Handles project name and description updates
 */
export const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  open,
  onClose,
  onSave,
  initialName,
  initialDescription = "",
  error,
}) => {
  // Form state management
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [nameError, setNameError] = useState<string | null>(null);

  /**
   * Handles the save operation for project updates
   * Validates input before submission
   */
  const handleSave = () => {
    if (!name.trim()) {
      setNameError("Project name is required");
      return;
    }
    onSave(name.trim(), description.trim());
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Project</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            error={!!nameError}
            helperText={nameError}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="Add a description for your project (optional)"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};