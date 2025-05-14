import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Alert,
} from "@mui/material";
import { CreateProjectDialogProps, CreateProjectDto } from "../../../../types";

/**
 * Dialog component for creating new projects
 * Handles project name input and submission
 */
export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
    open,
    onClose,
    onSubmit,
    error
}) => {
    // State management for form
    const [projectName, setProjectName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Handles the project creation submission
     * Validates and processes the project data
     */
    const handleSubmit = async () => {
        if (!projectName.trim()) return;
    
        try {
            setIsSubmitting(true);
    
            const projectData: CreateProjectDto = {
                name: projectName.trim(),
                description: "Default description",
                createdAt: new Date(),
                userId: ""
            };
    
            await onSubmit(projectData);
            setProjectName("");
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <TextField
                    autoFocus
                    margin="dense"
                    label="Project Name"
                    fullWidth
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    inputProps={{ maxLength: 255 }}
                    helperText="Project name must be between 1 and 255 characters"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitting || !projectName.trim()}
                >
                    {isSubmitting ? 'Creating...' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};