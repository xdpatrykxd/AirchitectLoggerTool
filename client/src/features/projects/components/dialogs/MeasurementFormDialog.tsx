import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Box,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

import serialHandler from "../utils/serialHandler";
import GetMeasurementData from "../utils/getMeasurementData";
import HiokiJson from "../utils/types";

/**
 * Interface for measurement form dialog props
 */
interface MeasurementFormDialogProps {
  open: boolean; // Controls dialog visibility
  onClose: () => void; // Handler for dialog close
  compressorId: string; // ID of the associated compressor
  userService: any; // Service for API interactions
  onMeasurementAdded?: () => void; // Optional callback after measurement addition
}

interface DataRow {
  [key: string]: number;
}

/**
 * Parses IiTrak2 log file content into structured data
 * @param fileContent - Raw content from the log file
 * @returns Object containing metadata and parsed measurement data
 */
const parseIiTrakFile = (fileContent: string) => {
  // Split content into lines and trim whitespace
  const lines = fileContent.split(/\r\n|\r|\n/).map((line) => line.trim());
  const metadata: Record<string, string> = {};
  const data: Array<{ [key: string]: number }> = [];

  let headers: string[] = [];
  let dataStarted = false;

  console.log("Total number of lines:", lines.length);

  // Process each line
  for (const line of lines) {
    if (!line) continue;

    console.log("Processing line:", line);

    // Look for header line containing "I (A)"
    if (!dataStarted && line.includes("I (A)")) {
      headers = line.split(/\t/).filter(Boolean);
      dataStarted = true;
      console.log("Headers found:", headers);
      continue;
    }

    // Process data lines after header
    if (dataStarted && !line.startsWith("-")) {
      const values = line.split(/\t/);
      const dataRow: { [key: string]: number } = {};

      headers.forEach((header, index) => {
        const value = parseFloat(values[index] || "0");
        dataRow[header] = isNaN(value) ? 0 : value;
      });

      data.push(dataRow);
      console.log("Data row added:", dataRow);
    }
    // Process metadata section
    else if (!dataStarted && line.includes(":")) {
      const parts = line.split(/\t/);
      parts.forEach((part) => {
        const [key, value] = part.split(":").map((str) => str.trim());
        if (key && value) {
          metadata[key] = value;
        }
      });
    }
  }

  console.log("Parsing complete. Number of data points:", data.length);
  return { metadata, data };
};

const parseHiokiJson = (HiokiData: HiokiJson) => {
  // Extract metadata
  const metadata = {
    deviceModel: HiokiData.receivedData.deviceModel,
    memoryTime: HiokiData.receivedData.memoryTime,
    systemTime: HiokiData.receivedData.systemTime,
    interval: HiokiData.receivedData.interval,
    flag: HiokiData.receivedData.flag,
  };

  // Extract data
  const headers: string[] = HiokiData.receivedData.channelData.map(
    (_, index) => `Channel ${index + 1}`
  );
  const data: DataRow[] = HiokiData.receivedData.sampleData.map((row) => {
    const dataRow: DataRow = {};
    headers.forEach((header, index) => {
      dataRow[header] = row[index] || 0; // Default to 0 if the value is undefined
    });
    return dataRow;
  });

  return { metadata, data };
};

/**
 * Dialog component for uploading and processing measurement data
 * Supports both IiTrak2 and Hioki logger types
 */
const MeasurementFormDialog: React.FC<MeasurementFormDialogProps> = ({
  open,
  onClose,
  compressorId,
  userService,
  onMeasurementAdded,
}) => {
  // State management
  const [logContent, setLogContent] = useState<string>("");
  const [parsedData, setParsedData] = useState<any>(null);
  const [fileNotification, setFileNotification] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggerType, setLoggerType] = useState<"IiTrak2" | "Hioki" | null>(
    null
  );
  const [status, setStatus] = useState<boolean>(false);

  /**
   * Handles file selection for IiTrak2 logger
   * Reads and parses the selected log file
   */
  const handleIiTrak2FileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      // Set up file reader callback
      reader.onload = () => {
        const content = reader.result as string;
        setLogContent(content);

        try {
          const parsed = parseIiTrakFile(content);
          setParsedData(parsed);
          setFileNotification(
            `✅ Successfully loaded and parsed file ${file.name}.`
          );
        } catch (parseError) {
          console.error("Error parsing the file:", parseError);
          setFileNotification(`❌ Failed to parse file ${file.name}.`);
        }
      };
      // Start reading the file as text
      reader.readAsText(file);
    }
  };

  /**
   * Initiates connection to Hioki device
   */
  const handleConnect = async () => {
    await serialHandler.init();
    setStatus(true);
  };

  /**
   * Retrieves measurement data from Hioki device
   */
  const handleGetMeasurementData = async () => {
    const [success, receivedData] = await GetMeasurementData();
    if (success) {
      const parsed = await parseHiokiJson(receivedData);
      setParsedData(parsed);
      console.log("Received Data:", receivedData);
    } else {
      console.error("Failed to get measurement data.");
    }
  };

  /**
   * Handles submission of parsed measurement data to database
   */
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!parsedData) {
        setError("Please upload and parse a valid log file before submitting.");
        return;
      }

      const measurementData = {
        ...parsedData,
        timestamp: new Date().toISOString(),
        compressorId,
        loggerType,
      };

      console.log("Submitting data:", measurementData);

      await userService.apiRequest("POST", "measurementsData", measurementData);

      onMeasurementAdded?.();
      handleClose();
    } catch (err) {
      console.error("Error uploading log content:", err);
      setError("Failed to upload log content to the database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resets form state and closes the dialog
   */
  const handleClose = () => {
    setLogContent("");
    setParsedData(null);
    setFileNotification("");
    setError(null);
    setLoggerType(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Upload Log File</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Logger Type Selection */}
          <Box mb={3}>
            <Typography variant="h6">Select Logger Type:</Typography>
            <Button
              variant="contained"
              sx={{ mr: 2, mt: 1 }}
              onClick={() => setLoggerType("IiTrak2")}
            >
              IiTrak2 Logger
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => setLoggerType("Hioki")}
            >
              Hioki Logger
            </Button>
          </Box>

          {loggerType === "IiTrak2" && (
            <>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                  IiTrak2 Logger Steps:
                </Typography>
                <Typography>1. Connect the IiTrak2 device via USB.</Typography>
                <Typography>
                  2. Navigate to the mounted volume's root directory to find the
                  log file.
                </Typography>
                <Typography>
                  3. Select the IITRAK2.LOG file and upload it below.
                </Typography>
              </Paper>

              <Box my={3}>
                <Button variant="contained" component="label">
                  Select .log file
                  <input
                    type="file"
                    hidden
                    onChange={handleIiTrak2FileChange}
                  />
                </Button>
              </Box>

              {fileNotification && (
                <Typography color="success.main" my={2}>
                  {fileNotification}
                </Typography>
              )}

              <Box my={3}>
                <TextField
                  multiline
                  fullWidth
                  rows={10}
                  value={logContent}
                  placeholder="Your log content will show up here"
                  InputProps={{
                    readOnly: true,
                    sx: { fontFamily: "monospace", fontSize: "13px" },
                  }}
                />
              </Box>

              {parsedData && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Parsed Data:
                  </Typography>
                  <pre
                    style={{
                      background: "#f5f5f5",
                      padding: "10px",
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                  >
                    {JSON.stringify(parsedData, null, 2)}
                  </pre>
                </Box>
              )}
            </>
          )}

          {loggerType === "Hioki" && (
            <>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Hioki Logger Steps:
                </Typography>
                <Typography>
                  1. Turn on HiokiD deviuce (press on button for 2sec)
                </Typography>
                <Typography>
                  2. Turn on bluetooth of Hioki device (Quick press the on
                  button)
                </Typography>
                <Typography>3. Turn on your computer's bluetooth</Typography>
                <Typography>
                  4. Search for the Hioki device (name should be something like
                  LR8515....) and try to connect it to your computer using the
                  bluetooth settings
                </Typography>
                <Typography>5. Click Connect button below</Typography>
                <Typography>
                  6. Select the Hioki device and click open.
                </Typography>
                <Typography>7. Click the retrieve button</Typography>
              </Paper>

              {!status ? (
                <Box>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleConnect}
                    disabled={status}
                  >
                    Connect
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleGetMeasurementData}
                    disabled={!status}
                  >
                    Get Data
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !loggerType}
        >
          {isSubmitting ? "Uploading..." : "Upload to Database"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MeasurementFormDialog;
