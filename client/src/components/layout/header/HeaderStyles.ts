import styled from "styled-components";
import { AppBar, Toolbar, Box } from "@mui/material";

export const StyledAppBar = styled(AppBar)`
  background-color: #0061af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  height: 64px;
  padding-left: 16px;
  padding-right: 16px;

  @media (min-width: 640px) {
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 1024px) {
    padding-left: 32px;
    padding-right: 32px;
  }
`;

export const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

export const StyledImg = styled.img`
  height: 32px;
  width: auto;

  @media (min-width: 640px) {
    height: 40px;
  }
`;
