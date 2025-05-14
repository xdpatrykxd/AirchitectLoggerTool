import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { auth0Config } from "./features/auth";
import App from "./App";

/**
 * Application entry point
 * Sets up React strict mode and Auth0 authentication provider
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider {...auth0Config}>
      <App />
    </Auth0Provider>
  </StrictMode>
);