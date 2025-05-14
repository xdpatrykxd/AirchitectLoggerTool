import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton as StyledLogoutButton } from "./styles";

/**
 * Button component that handles Auth0 logout flow
 * Redirects to origin after successful logout
 */
export const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <StyledLogoutButton
      variant="contained"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Sign Out
    </StyledLogoutButton>
  );
};