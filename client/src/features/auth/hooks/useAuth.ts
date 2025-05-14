import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * Custom hook for managing authentication state and token storage
 * Integrates with Auth0 and handles local token management
 * @returns Authentication states and error information
 */
export const useAuth = () => {
  // Get authentication states from Auth0
  const { isAuthenticated, isLoading, getAccessTokenSilently, error } = useAuth0();
  
  // State for handling custom authentication errors
  const [authError, setAuthError] = useState<string | null>(null);

  /**
   * Stores the access token in localStorage when user is authenticated
   * Runs on authentication state changes
   */
  useEffect(() => {
    const storeToken = async () => {
      if (isAuthenticated) {
        try {
          // Retrieve token from Auth0
          const token = await getAccessTokenSilently();
          // Store token in localStorage for persistence
          localStorage.setItem("accessToken", token);
        } catch (err) {
          console.error("Error fetching access token:", err);
          setAuthError("Failed to fetch access token");
        }
      }
    };

    storeToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return {
    isAuthenticated,  // Whether the user is currently authenticated
    isLoading,       // Authentication process loading state
    error,          // Auth0 specific errors
    authError       // Custom authentication errors
  };
};