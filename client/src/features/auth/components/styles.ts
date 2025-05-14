import styled from "styled-components";
import {Alert, Avatar, Box, Button, ListItem, Paper, Typography} from "@mui/material";

export const LoginButton = styled(Button)`
  && {
    width: 100%;
    background-color: #0061af;
    color: white;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 6px;
    text-transform: none;
    transition: background-color 200ms;

    &:hover {
      background-color: #004f8c;
    }

    .MuiButton-startIcon {
      margin-right: 8px;
    }
  }
`;

export const LogoutButton = styled(Button)`
  && {
    background-color: white;
    color: #374151;
    font-weight: 600;
    text-transform: none;
    padding: 8px 16px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    transition: background-color 200ms;

    &:hover {
      background-color: #f3f4f6;
      border-color: #d1d5db;
    }
  }
`;

export const StyledErrorAlert = styled(Alert)`
  && {
    margin-bottom: 16px;
    border-radius: 6px;
    .MuiAlert-message {
      padding: 8px 0;
    }
    .MuiAlert-icon {
      font-size: 24px;
    }
    animation: slideDown 0.3s ease-out;
    @keyframes slideDown {
      from {
        transform: translateY(-10px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
`;

export const ProfileContainer = styled(Paper)`
  && {
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

export const ProfileAvatar = styled(Avatar)`
  && {
    width: 96px;
    height: 96px;
    border: 2px solid #0061af;
  }
`;

export const InfoLabel = styled(Typography)`
  && {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 4px;
  }
`;

export const InfoValue = styled(Typography)`
  && {
    color: #111827;
  }
`;

export const ProfileSection = styled(Box)`
  && {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;



// Unauthenticated styles
export const UnauthViewContainer = styled(Box)`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
  }
`;

export const LoginCard = styled(Paper)`
  && {
    background-color: white;
    padding: 32px;
    border-radius: 12px;
    width: 100%;
    max-width: 448px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    transition: transform 0.2s ease-in-out;
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

export const Title = styled(Typography)`
  && {
    color: #111827;
    font-weight: 700;
    margin-bottom: 32px;
    text-align: center;
  }
`;

export const Subtitle = styled(Typography)`
  && {
    color: #4b5563;
    text-align: center;
    margin-bottom: 24px;
  }
`;

// Authenticated styles
export const AuthViewContainer = styled(Paper)`
  && {
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

export const CreateProjectButton = styled(Button)`
  && {
    background-color: #0061af;
    color: white;
    padding: 12px 24px;
    font-weight: 600;
    text-transform: none;
    margin-bottom: 20px;
    &:hover {
      background-color: #004f8c;
    }
  }
`;

export const ProjectItem = styled(ListItem)`
  && {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    margin-bottom: 8px;
  }
`;

