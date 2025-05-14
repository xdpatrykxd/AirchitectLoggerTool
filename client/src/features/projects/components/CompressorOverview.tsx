import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  List,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/**
 * Interface defining the structure of a compressor
 */
interface Compressor {
  compressorId?: string;
  model: string;
  capacity: number;
  measurements: any[];
  projectId: string;
}

/**
 * Props interface for the DeleteConfirmationDialog component
 */
interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  compressorName: string;
}

/**
 * Component for confirming compressor deletion
 */
const DeleteConfirmationDialog: React.FC<DeleteDialogProps> = ({ 
  open, 
  onClose, 
  onConfirm, 
  compressorName 
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Delete Compressor</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete the compressor "{compressorName}"? This
        action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

/**
 * Props interface for the CreateCompressorDialog component
 */
interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (compressor: Compressor) => Promise<void>;
  projectId: string;
}

/**
 * Dialog component for creating new compressors
 */
const CreateCompressorDialog: React.FC<CreateDialogProps> = ({
  open,
  onClose,
  onSubmit,
  projectId,
}) => {
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState<number>(0.01);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles the submission of new compressor data
   */
  const handleSubmit = async () => {
    try {
      if (!model.trim()) {
        setError("Please enter a model name");
        return;
      }

      if (capacity <= 0) {
        setError("Capacity must be greater than 0");
        return;
      }

      setIsSubmitting(true);
      await onSubmit({
        model,
        capacity,
        measurements: [],
        projectId,
      });

      setModel("");
      setCapacity(0.01);
      setError(null);
      onClose();
    } catch (err) {
      setError("Failed to create compressor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Compressor</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Model Name"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            fullWidth
          />
          <TextField
            label="Capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 0.01, step: 0.01 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Compressor"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * Props interface for the CompressorOverview component
 */
interface CompressorOverviewProps {
  projectId: string;
  userService: any;
}

/**
 * Main component for managing compressors within a project
 */
const CompressorOverview: React.FC<CompressorOverviewProps> = ({
  projectId,
  userService,
}) => {
  const navigate = useNavigate();
  const [compressors, setCompressors] = useState<Compressor[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogCompressor, setDeleteDialogCompressor] = useState<Compressor | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches compressors for the current project
   */
  const fetchCompressors = async () => {
    try {
      const response = await userService.apiRequest("GET", "compressors");
      const projectCompressors = response.filter(
        (c: Compressor) => c.projectId === projectId
      );
      setCompressors(projectCompressors || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching compressors:", err);
      setCompressors([]);
      setError("Failed to load compressors");
    }
  };

  useEffect(() => {
    fetchCompressors();
  }, [projectId, userService]);

  /**
   * Handles creation of a new compressor
   */
  const handleCreateCompressor = async (compressorData: Compressor) => {
    try {
      await userService.apiRequest(
        "POST",
        "compressors",
        compressorData
      );
      await fetchCompressors();
      setError(null);
    } catch (err) {
      console.error("Error creating compressor:", err);
      setError("Failed to create compressor");
      throw err;
    }
  };

  /**
   * Handles deletion of a compressor
   */
  const handleDeleteCompressor = async () => {
    if (deleteDialogCompressor) {
      await userService.apiRequest(
        "DELETE",
        `compressors/${deleteDialogCompressor.compressorId}`
      );
      await fetchCompressors();
      setDeleteDialogCompressor(null);
    }
  };

  /**
   * Handles navigation to compressor details
   */
  const handleCompressorClick = (compressor: Compressor) => {
    if (compressor.compressorId) {
      navigate(`/projects/${projectId}/compressors/${compressor.compressorId}`);
    }
  };

  return (
    <Box>
      <IconButton onClick={() => navigate(`/`)} sx={{ mr: 2 }}>
        <ArrowBackIcon />
      </IconButton>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Compressor Room Definition</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Add Compressor
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {compressors && compressors.length > 0 ? (
          compressors.map((compressor) => (
            <ListItemButton
              key={compressor.model}
              onClick={() => handleCompressorClick(compressor)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemText
                primary={compressor.model}
                secondary={`Capacity: ${compressor.capacity}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialogCompressor(compressor);
                  }}
                  sx={{ mr: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCompressorClick(compressor);
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItemButton>
          ))
        ) : (
          <Typography color="text.secondary" sx={{ p: 2 }}>
            No compressors found
          </Typography>
        )}
      </List>

      <CreateCompressorDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateCompressor}
        projectId={projectId}
      />

      <DeleteConfirmationDialog
        open={!!deleteDialogCompressor}
        onClose={() => setDeleteDialogCompressor(null)}
        onConfirm={handleDeleteCompressor}
        compressorName={deleteDialogCompressor?.model || ""}
      />
    </Box>
  );
};

export default CompressorOverview;