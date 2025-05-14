import styled from "styled-components";
import { Paper, Box } from "@mui/material";

export const ViewContainer = styled(Paper)`
  && {
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

export const ProjectHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const ActionButtons = styled(Box)`
  display: flex;
  gap: 12px;
`;
