// src/services/authService.ts
import { Auth0Client } from '@auth0/auth0-spa-js';

export class AuthService {
  // Store tokens in this service
  private accessToken: string | null = null;
  private permissionsToken: string | null = null;

  constructor(
    private auth0Client: Auth0Client,
    private managementApiUrl: string = 'REDACTED'
  ) {}

  /**
   * Step 1: Get initial access token from Auth0
   * @returns Promise containing the access token
   */
  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      this.accessToken = await this.auth0Client.getTokenSilently({
        authorizationParams: {
          audience: 'REDACTED',
          scope: 'read:roles'
        }
      });
      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to get access token');
    }
  }

  /**
   * Step 2: Use access token to fetch permissions
   * @returns Promise containing the permissions token
   */
  async getPermissionsToken(): Promise<string> {
    if (this.permissionsToken) {
      return this.permissionsToken;
    }

    try {
      // First get the access token
      const accessToken = await this.getAccessToken();

      // Use access token to request data from Auth0 Management API
      const response = await fetch(`${this.managementApiUrl}/users/${this.getUserId()}/roles`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get permissions');
      }

      const permissions = await response.json();
      
      // Store permissions in a token format that our API can verify
      this.permissionsToken = this.formatPermissionsToken(permissions);
      
      return this.permissionsToken;
    } catch (error) {
      console.error('Error getting permissions token:', error);
      throw new Error('Failed to get permissions token');
    }
  }

  /**
   * Step 3: Provide permissions token for API calls
   * @returns Headers object with authorization details
   */
  async getAuthorizationHeader(): Promise<Headers> {
    const permissionsToken = await this.getPermissionsToken();
    
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${permissionsToken}`);
    headers.append('Content-Type', 'application/json');
    
    return headers;
  }

  /**
   * Helper function to get user ID
   * @returns Promise containing the user ID
   */
  private async getUserId(): Promise<string> {
    const user = await this.auth0Client.getUser();
    if (!user || !user.sub) {
      throw new Error('User not found');
    }
    return user.sub;
  }

  /**
   * Helper function to convert permissions to token format
   * @param permissions - Array of user permissions
   * @returns Formatted token string
   */
  private formatPermissionsToken(permissions: any[]): string {
    // Example implementation - in practice, you would create a JWT
    // or another format that your backend can verify
    return btoa(JSON.stringify(permissions));
  }

  /**
   * Function to refresh tokens when they expire
   */
  async refreshTokens(): Promise<void> {
    this.accessToken = null;
    this.permissionsToken = null;
    await this.getPermissionsToken();
  }
}

// Export factory function to create the service
export const createAuthService = (auth0Client: Auth0Client) => {
  return new AuthService(auth0Client);
};