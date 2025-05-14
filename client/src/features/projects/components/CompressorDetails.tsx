import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import MeasurementFormDialog from "./dialogs/MeasurementFormDialog";

/**
 * Interface for compressor data structure
 */
interface Compressor {
  compressorId?: string;
  model: string;
  capacity: number;
  measurements: any[];
  projectId: string;
  loggerType: "hioki" | "iitrak";
}

/**
 * Props interface for CompressorDetails component
 */
interface CompressorDetailsProps {
  userService: any; // Service for API interactions
  compressorId: string;
  projectId: string;
}

/**
 * Interface for measurement data structure
 */
interface MeasurementData {
  measurementDataId: string;
  data: JSON;
  timestamp: string;
  compressorId: string;
}

/**
 * CompressorDetails Component
 * Displays detailed information about a specific compressor and its measurements
 */
const CompressorDetails: React.FC<CompressorDetailsProps> = ({
  userService,
  compressorId,
  projectId,
}) => {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
  const [compressor, setCompressor] = useState<Compressor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMeasurementDialogOpen, setIsMeasurementDialogOpen] = useState(false);
  const [selecteddata, setSelecteddata] = useState<JSON | null>(null);

  /**
   * Fetches compressor details from the API
   */
  const fetchCompressor = async () => {
    try {
      setIsLoading(true);
      const response = await userService.apiRequest(
        "GET",
        `compressors/${compressorId}`
      );
      setCompressor(response);
      setError(null);
    } catch (err) {
      console.error("Error fetching compressor:", err);
      setError("Failed to load compressor details");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches all measurements for the current compressor
   */
  const fetchMeasurements = async () => {
    try {
      const response = await userService.apiRequest("GET", "measurementsData");
      const compressorMeasurements = response.filter(
        (m: MeasurementData) => m.compressorId === compressorId
      );
      console.log(compressorMeasurements)
      setMeasurements(compressorMeasurements);
    } catch (err) {
      console.error("Error fetching measurements:", err);
      setError("Failed to load measurements");
    }
  };

  // Load compressor and measurement data on component mount
  useEffect(() => {
    if (compressorId) {
      fetchCompressor();
      fetchMeasurements();
    }
  }, [compressorId]);

  /**
   * Handles deletion of a measurement
   * @param measurementId - ID of the measurement to delete
   */
  const handleDeleteMeasurement = async (measurementId: string) => {
    try {
      await userService.apiRequest(
        "DELETE",
        `measurementsData/${measurementId}`
      );
      fetchMeasurements();
    } catch (err) {
      console.error("Error deleting measurement:", err);
      setError("Failed to delete measurement");
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

  // Error or not found state display
  if (error || !compressor) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || "Compressor not found"}</Alert>
        <Button
          onClick={() => navigate(`/projects/${projectId}`)}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Project
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header with navigation */}
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton
          onClick={() => navigate(`/projects/${projectId}`)}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Compressor: {compressor.model}</Typography>
      </Box>

      {/* Compressor Details Section */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Details
        </Typography>
        <Typography>
          <strong>Model:</strong> {compressor.model}
        </Typography>
        <Typography>
          <strong>Capacity:</strong> {compressor.capacity}
        </Typography>
        <Typography>
          <strong>Logger Type:</strong> {compressor.loggerType}
        </Typography>
      </Box>

      {/* Measurements Section */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Measurements
        </Typography>
        <Button
          variant="contained"
          onClick={() => setIsMeasurementDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          Add Measurement
        </Button>

        {measurements.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>data</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {measurements 
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((measurement) => (
                    <TableRow key={measurement.measurementDataId}>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setSelecteddata(measurement.data)}
                        >
                          Show data
                        </Button>
                      </TableCell>
                      <TableCell>
                        {new Date(measurement.timestamp).toLocaleString("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteMeasurement(measurement.measurementDataId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary">No measurements yet</Typography>
        )}
      </Box>

      {/* Measurement Form Dialog */}
      <MeasurementFormDialog
        open={isMeasurementDialogOpen}
        onClose={() => setIsMeasurementDialogOpen(false)}
        compressorId={compressorId}
        userService={userService}
        onMeasurementAdded={fetchMeasurements}
      />

      {/* Dialog to show selected measurement JSON data */}
      {/* Modal to show the selected measurement data */}
<Dialog
  open={Boolean(selecteddata)} // Ensures modal opens only when a data is set
  onClose={() => {
    console.log("Closing modal");
    setSelecteddata(null); // Reset the state when modal is closed
  }}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Measurement data</DialogTitle>
  <DialogContent>
    {selecteddata ? ( // Debugging if selecteddata is passed correctly
      <Box
        sx={{
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "5px",
          fontFamily: "monospace",
          fontSize: "14px",
        }}
      >
        <pre>{JSON.stringify(selecteddata, null, 2)}</pre>
      </Box>
    ) : (
      <Typography color="error">
        No data selected. Debugging state: {JSON.stringify(selecteddata)}
      </Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => {
        console.log("Modal closed, resetting selecteddata.");
        setSelecteddata(null); // Close and reset modal
      }}
      variant="contained"
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default CompressorDetails;