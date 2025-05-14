import React, { useMemo } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  CircularProgress,
  Typography,
  Container,
} from "@mui/material";
import { mainTheme } from "./config/theme/mainTheme";
import {
  useAuth,
  AuthenticatedView,
  UnauthenticatedView,
  AuthError,
} from "./features/auth";
import { ProjectOverview } from "./features/projects";
import CompressorDetails from "./features/projects/components/CompressorDetails";
import Header from "./components/layout/header/Header";
import { createUserService } from "./services/userService";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * Loading screen component displayed during authentication checks
 */
const LoadingView = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress color="primary" />
    <Typography variant="h6" color="primary" sx={{ ml: 2 }}>
      Loading...
    </Typography>
  </Box>
);

/**
 * Wrapper component for ProjectOverview that handles route parameters
 */
const ProjectOverviewWrapper = () => {
  useParams();
  return <ProjectOverview />;
};

/**
 * Props interface for CompressorDetailsWrapper
 */
interface CompressorDetailsWrapperProps {
  userService: any; // Consider creating a specific type for userService
}

/**
 * Wrapper component for CompressorDetails that handles route parameters
 */
const CompressorDetailsWrapper = ({ userService }: CompressorDetailsWrapperProps) => {
  const { compressorId, projectId } = useParams();

  if (!compressorId || !projectId) {
    return <Typography>Invalid compressor or project ID</Typography>;
  }

  return (
    <CompressorDetails
      userService={userService}
      compressorId={compressorId}
      projectId={projectId}
    />
  );
};

/**
 * Main application component
 * Handles routing, authentication, and layout structure
 */
const App: React.FC = () => {
  const { isAuthenticated, isLoading, error, authError } = useAuth();
  const { getAccessTokenSilently } = useAuth0();

  // Create memoized user service instance
  const userService = useMemo(
    () => createUserService(getAccessTokenSilently),
    [getAccessTokenSilently]
  );

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
          <Header isAuthenticated={isAuthenticated} />

          <Container
            maxWidth="lg"
            sx={{
              py: 4,
              mt: 2,
            }}
          >
            <AuthError errorMessage={error?.message || authError} />

            <Routes>
              {/* Home route */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <AuthenticatedView />
                  ) : (
                    <UnauthenticatedView />
                  )
                }
              />

              {/* Project details route */}
              <Route
                path="/projects/:id"
                element={
                  isAuthenticated ? (
                    <ProjectOverviewWrapper />
                  ) : (
                    <UnauthenticatedView />
                  )
                }
              />

              {/* Compressor details route */}
              <Route
                path="/projects/:projectId/compressors/:compressorId"
                element={
                  isAuthenticated ? (
                    <CompressorDetailsWrapper userService={userService} />
                  ) : (
                    <UnauthenticatedView />
                  )
                }
              />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;