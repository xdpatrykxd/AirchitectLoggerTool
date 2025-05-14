import { Auth0ProviderOptions, CacheLocation } from "@auth0/auth0-react";

/**
 * Auth0 Configuration
 * Contains settings for Auth0 authentication provider
 */
export const auth0Config: Auth0ProviderOptions = {
  // Auth0 tenant domain
  domain: "REDACTED",
  
  // Application client ID
  clientId: "REDACTED",
  
  // Authorization parameters
  authorizationParams: {
    // Redirect URI after successful login
    redirect_uri: window.location.origin,
    
    // Management API audience for token access
    audience: "REDACTED",
    
    // Required OAuth scopes
    scope: "openid profile email offline_access"
  },
  
  // Enable refresh token rotation
  useRefreshTokens: true,
  
  // Store auth state in localStorage
  cacheLocation: "localstorage" as CacheLocation
};