import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Typography,
  Button,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { ViewContainer, ProjectHeader, ActionButtons } from "./styles";
import { EditProjectDialog } from "./dialogs/EditProjectDialog";
import { CreateProjectDto, Project } from "../../../types";
import { createProjectService } from "../../../services/projectService";
import CompressorOverview from "./CompressorOverview";

/**
 * ProjectOverview Component
 * Displays and manages a single project's details and its compressors.
 * Provides functionality for editing and deleting the project.
 */
const ProjectOverview: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  
  // State management
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * Initialize project service with memoization to prevent unnecessary recreations
   */
  const projectService = useMemo(
    () => createProjectService(getAccessTokenSilently),
    [getAccessTokenSilently]
  );

  /**
   * Fetches project details when component mounts or when ID changes
   */
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await projectService.getProject(id);
        setProject(data);
        setError(null);
      } catch (err) {
        console.error("Error loading project:", err);
        setError("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, projectService]);

  /**
   * Handles project update operations
   * @param newName - New name for the project
   * @param newDescription - Optional new description for the project
   */
  const handleEdit = async (newName: string, newDescription?: string) => {
    if (!project) return;
  
    try {
      const updatedProjectPayload: Partial<CreateProjectDto> = {
        name: newName,
        description: newDescription || project.description
        // Omit createdAt since we don't need to update it
      };
  
      await projectService.updateProject(project.projectId, updatedProjectPayload);
      const updatedProject = await projectService.getProject(project.projectId);
      setProject(updatedProject);
      setIsEditDialogOpen(false);
      setShowConfirm(true);
    } catch (err) {
      console.error("Error updating project:", err);
      setError("Failed to update project");
    }
  };

  /**
   * Handles project deletion
   * Redirects to home page on successful deletion
   */
  const handleDelete = async () => {
    if (project) {
      try {
        await projectService.deleteProject(project.projectId);
        navigate("/");
      } catch (err) {
        console.error("Error deleting project:", err);
        setError("Failed to delete project");
      }
    }
  };

  // Loading state display
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Not found state display
  if (!project) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Project not found</Typography>
      </Box>
    );
  }

  return (
    <ViewContainer>
      <ProjectHeader>
        <Box>
          <Typography variant="h5">{project.name}</Typography>
          {project.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {project.description}
            </Typography>
          )}
        </Box>
        <ActionButtons>
          <Button
            startIcon={<Edit />}
            onClick={() => setIsEditDialogOpen(true)}
          >
            Edit
          </Button>
          <Button
            startIcon={<Delete />}
            onClick={() => setIsDeleteDialogOpen(true)}
            color="error"
          >
            Delete
          </Button>
        </ActionButtons>
      </ProjectHeader>

      <Box>
        <CompressorOverview
          projectId={project.projectId}
          userService={projectService.userService}
        />
      </Box>

      {/* Success notification */}
      {showConfirm && (
        <Alert
          severity="success"
          action={
            <Button color="inherit" size="small" onClick={() => navigate("/")}>
              Return to Dashboard
            </Button>
          }
        >
          Project updated successfully
        </Alert>
      )}

      {/* Edit project dialog */}
      <EditProjectDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEdit}
        initialName={project.name}
        initialDescription={project.description}
        error={error}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this project? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ViewContainer>
  );
};

export default ProjectOverview;