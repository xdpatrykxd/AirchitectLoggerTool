import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ProfileContainer,
  ProfileAvatar,
  InfoLabel,
  InfoValue,
  ProfileSection,
} from "./styles";
import { formatDate } from "../utils";
import { createUserService } from "../../../services/userService";
import { User } from "../../../types";

/**
 * Profile component displays user information from both Auth0 and local database
 * Handles user creation if they don't exist in the local database
 */
export const Profile: React.FC = () => {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    /**
     * Loads or creates user details in the local database
     * First attempts to fetch existing user, creates new user if not found
     */
    const loadUserDetails = async () => {
      if (!isAuthenticated || !auth0User || !auth0User.sub) return;

      try {
        setIsLoadingDetails(true);
        const userService = createUserService(getAccessTokenSilently);

        // Clean and encode the Auth0 ID
        const cleanAuth0Id = auth0User.sub.split("|")[1];
        const encodedUserId = encodeURIComponent(cleanAuth0Id);

        try {
          // Attempt to fetch existing user
          const userGuid = await userService.apiRequest(
            "GET",
            `Users/by-auth0id/${encodedUserId}`
          );

          if (userGuid) {
            // Fetch full user details if user exists
            const existingUser = await userService.apiRequest(
              "GET",
              `Users/${userGuid}`
            );
            setUserData(existingUser);
          }
        } catch (err) {
          // Create new user if not found (404 error)
          console.log("User not found, creating new user...");
          const newUser = await userService.postCurrentUser();
          setUserData(newUser);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to load/create user details:", err);
        setError("Could not load or create profile information");
      } finally {
        setIsLoadingDetails(false);
      }
    };

    loadUserDetails();
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);

  // Show loading spinner while initial Auth0 authentication is in progress
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Don't render anything if user is not authenticated
  if (!isAuthenticated || !auth0User) {
    return null;
  }

  /**
 * Helper function to ensure we have a valid date string
 * @param dateValue - Date value that could be string, Date object or undefined
 * @returns Formatted date string
 */
const getValidDateString = (dateValue: string | Date | undefined): string => {
  if (!dateValue) {
    return new Date().toISOString();
  }
  
  if (dateValue instanceof Date) {
    return dateValue.toISOString();
  }
  
  return dateValue;
};

  return (
    <ProfileContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: { xs: "center", md: "flex-start" },
        }}
      >
        <Box flexShrink={0}>
          <ProfileAvatar
            src={userData?.picture || auth0User.picture}
            alt={userData?.name || auth0User.name}
          />
        </Box>

        <ProfileSection flexGrow={1}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {userData?.name || auth0User.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userData?.email || auth0User.email}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Profile Information
            </Typography>

            {isLoadingDetails ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoLabel>Email verified</InfoLabel>
                  <InfoValue>
                    {userData?.emailVerified || auth0User.email_verified
                      ? "Yes"
                      : "No"}
                  </InfoValue>
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoLabel>Last updated</InfoLabel>
                  <InfoValue>
                    {formatDate(
                      getValidDateString(
                        userData?.updatedAt || auth0User.updated_at
                      )
                    )}
                  </InfoValue>
                </Grid>
                {error && (
                  <Grid item xs={12}>
                    <Typography color="error" variant="body2">
                      {error}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </ProfileSection>
      </Box>
    </ProfileContainer>
  );
};
