import styled from "styled-components";
import { Container, Box } from "@mui/material";

export const StyledMain = styled(Container)`
  padding-top: ${(props) => props.theme.spacing?.(6)}px;
  padding-bottom: ${(props) => props.theme.spacing?.(6)}px;
  min-height: calc(100vh - 64px);
  background-color: #f5f5f5;
`;

export const LoadingWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;
