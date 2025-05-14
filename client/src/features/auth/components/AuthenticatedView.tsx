import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Typography,
  Box,
  List,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  ListItemButton,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import {
  AuthViewContainer,
  CreateProjectButton,
} from "./styles";
import { Profile } from "../index";
import { CreateProjectDialog } from "../../projects";
import { CreateProjectDto, Project } from "../../../types";
import { createProjectService } from "../../../services/projectService";

/**
 * Main authenticated view component that displays user's projects and profile
 * Handles project creation, listing, and navigation
 */
export const AuthenticatedView: React.FC = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create project service instance with memoization
  const projectService = useMemo(
    () => createProjectService(getAccessTokenSilently),
    [getAccessTokenSilently]
  );

  // Fetch projects on component mount and service updates
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await projectService.getProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [projectService]);

  /**
   * Handles project creation and updates project list
   * @param projectData - Data for new project
   */
  const handleCreateProject = async (projectData: CreateProjectDto) => {
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects((prev) => [...prev, newProject]);
      setIsCreateDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error("Error creating project:", err);
      setError("Failed to create project");
      throw err;
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthViewContainer elevation={2}>
      <Profile />
      <Box mt={6}>
        <CreateProjectButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create New Project
        </CreateProjectButton>

        <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 2 }}>
          Your Projects
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <List>
          {projects.map((project) => (
            <ListItemButton
              key={project.projectId}
              onClick={() => navigate(`/projects/${project.projectId}`)}
            >
              <ListItemText
                primary={project.name}
                secondary={`Created: ${new Date(project.createdAt).toLocaleDateString()}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => navigate(`/projects/${project.projectId}`)}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItemButton>
          ))}
        </List>

        <CreateProjectDialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateProject}
          error={error}
        />
      </Box>
    </AuthViewContainer>
  );
};