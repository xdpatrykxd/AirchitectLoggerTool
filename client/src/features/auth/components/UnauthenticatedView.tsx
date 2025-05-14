import React from "react";
import { Container } from "@mui/material";
import {
  UnauthViewContainer,
  LoginCard,
  Title,
  Subtitle,
} from "./styles";
import { LoginButton } from "../index";

/**
 * UnauthenticatedView Component
 * Displays the landing page for users who are not logged in
 * Provides login functionality through Auth0
 */
export const UnauthenticatedView: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <UnauthViewContainer>
        <Title variant="h3">Welcome to Atlas Copco Portal</Title>
        <LoginCard elevation={2}>
          <Subtitle variant="body1">
            Please log in to access your account
          </Subtitle>
          <LoginButton />
        </LoginCard>
      </UnauthViewContainer>
    </Container>
  );
};