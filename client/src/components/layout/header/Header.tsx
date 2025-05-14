import React from "react";
import { Box } from "@mui/material";
import { HeaderProps } from "./types";
import {
  StyledAppBar,
  StyledToolbar,
  LogoContainer,
  StyledImg,
} from "./HeaderStyles";
import {LogoutButton} from "../../../features/auth";
import logo from "../../../assets/images/Atlas-Copco-Logo.svg.png";

/**
 * Header component that displays the application's top navigation bar
 * Contains the Atlas Copco logo and a logout button when user is authenticated
 * @param {boolean} isAuthenticated - Flag indicating if user is logged in
 */
const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        {/* Logo container with company branding */}
        <LogoContainer>
          <StyledImg src={logo} alt="Atlas Copco" />
        </LogoContainer>
        {/* Conditional rendering of logout button for authenticated users */}
        {isAuthenticated && (
          <Box sx={{ ml: 2 }}>
            <LogoutButton />
          </Box>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;