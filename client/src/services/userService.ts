import { User } from "../types";

/**
 * Custom error class for API-related errors
 * Includes HTTP status code and descriptive message
 */
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Type definition for the Auth0 token function
type GetTokenSilently = () => Promise<string>;

/**
 * Service for handling user-related operations and API authentication
 * Manages user data, authentication tokens, and API requests
 */
export class UserService {
  private cachedToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(private getAccessTokenSilently: GetTokenSilently) {}

  /**
   * Gets bearer token for API authentication
   * @returns Promise containing the access token
   */
  private async getBearerToken(): Promise<string> {
    try {
      const response = await fetch(
        "REDACTED",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: "REDACTED",
            client_secret:
              "REDACTED",
            audience: "http://localhost:5053/api/Users",
            grant_type: "client_credentials",
          }),
        }
      );
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error getting bearer token:", error);
      throw error;
    }
  }

  /**
   * Handles API response errors and token invalidation
   * @param response - Fetch API response object
   * @returns Promise containing parsed response data
   * @throws ApiError if response is not OK
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (response.status === 401) {
        this.cachedToken = null;
        this.tokenExpiry = null;
      }

      throw new ApiError(
        response.status,
        `API Error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    return response.json();
  }

  /**
   * Gets headers with bearer token
   * @returns Promise containing Headers object with authorization
   */
  private async getHeaders(): Promise<Headers> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    try {
      const now = Date.now();
      if (!this.cachedToken || !this.tokenExpiry || now >= this.tokenExpiry) {
        console.log("Getting new access token...");
        const token = await this.getBearerToken();
        this.cachedToken = token;
        this.tokenExpiry = now + 3600000; // Token expires in 1 hour
      }

      headers.append("Authorization", `Bearer ${this.cachedToken}`);
    } catch (error) {
      console.error("Error getting access token:", error);
      throw error;
    }

    return headers;
  }

  /**
   * Makes API requests with proper error handling
   * @param method - HTTP method
   * @param route - API route
   * @param body - Request body (optional)
   * @returns Promise containing API response
   */
  async apiRequest(
    method: string,
    route: string,
    body: any = null
  ): Promise<any> {
    const headers = await this.getHeaders();

    const options: RequestInit = {
      method: method,
      headers: headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(
        `http://localhost:5053/api/${route}`,
        options
      );
      
      // Special handling for DELETE requests and 204 responses
      if (method === 'DELETE' || response.status === 204) {
        return null;
      }
      
      return this.handleResponse<any>(response);
    } catch (error) {
      console.error(`Error making ${method} request to /${route}:`, error);
      throw error;
    }
  }

  /**
   * Gets user information from Auth0
   * @returns Promise containing Auth0 user information
   */
  async getAuth0UserInfo(): Promise<any> {
    try {
      const token = await this.getAccessTokenSilently();
      const response = await fetch(
        "https://dev-6swtzpgbcl7khap1.eu.auth0.com/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get user info");
      }

      return response.json();
    } catch (error) {
      console.error("Error getting user info:", error);
      throw error;
    }
  }

  /**
   * Gets current user information
   * @returns Promise containing user data
   */
  async getCurrentUser(): Promise<User> {
    try {
      const userData = await this.apiRequest("GET", "users");
      console.log("User data received:", {
        ...userData,
        access_token: "[REDACTED]",
      });

      return {
        auth0Id: userData.sub,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        emailVerified: userData.email_verified,
        updatedAt: new Date(userData.updated_at),
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

  /**
   * Cleans Auth0 ID by removing provider prefix
   * @param sub - Auth0 subject identifier
   * @returns Cleaned Auth0 ID
   */
  private cleanAuth0Id(sub: string): string {
    return sub.split("|")[1];
  }

  /**
   * Posts current user data to the API
   * @returns Promise containing API response
   */
  async postCurrentUser(): Promise<any> {
    try {
      const auth0User = await this.getAuth0UserInfo();
      console.log("Auth0 user info received:", auth0User);

      const currentUser = {
        auth0Id: this.cleanAuth0Id(auth0User.sub),
        name: auth0User.name,
        givenName: auth0User.given_name,
        familyName: auth0User.family_name,
        nickname: auth0User.nickname,
        email: auth0User.email,
        picture: auth0User.picture,
        emailVerified: auth0User.email_verified,
        createdAt: new Date().toISOString(),
      };
      console.log("Sending user data to backend:", currentUser);
      return await this.apiRequest("POST", "users", currentUser);
    } catch (error) {
      console.error("Error posting current user:", error);
      throw error;
    }
  }
}

// Factory function to create UserService instance
export const createUserService = (getAccessTokenSilently: GetTokenSilently) => {
  return new UserService(getAccessTokenSilently);
};