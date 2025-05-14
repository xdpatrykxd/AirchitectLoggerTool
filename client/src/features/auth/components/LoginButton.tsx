import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginOutlined } from "@mui/icons-material";
import { LoginButton as StyledLoginButton } from "./styles";

/**
 * Button component that initiates Auth0 login flow
 */
export const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <StyledLoginButton
      variant="contained"
      onClick={() => loginWithRedirect()}
      startIcon={<LoginOutlined />}
    >
      Sign In
    </StyledLoginButton>
  );
};