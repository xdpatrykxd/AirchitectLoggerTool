import React from "react";
import { AlertTitle } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { StyledErrorAlert } from "./styles";

interface AuthErrorProps {
  errorMessage?: string | null;
}

/**
 * Displays authentication-related error messages in a styled alert
 * @param errorMessage - Optional error message to display
 */
export const AuthError: React.FC<AuthErrorProps> = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <StyledErrorAlert severity="error" icon={<WarningIcon />} variant="filled">
      <AlertTitle>Authentication Error</AlertTitle>
      {errorMessage}
    </StyledErrorAlert>
  );
};