import { Project, CreateProjectDto } from "../types";
import { UserService } from "./userService";

/**
 * Service for handling project-related operations
 * Manages CRUD operations for projects and handles user verification
 */
export class ProjectService {
  public userService: UserService;

  constructor(getAccessTokenSilently: any) {
    this.userService = new UserService(getAccessTokenSilently);
  }

  /**
   * Retrieves all projects
   * @returns Promise containing array of projects
   */
  async getProjects(): Promise<Project[]> {
    try {
      console.log("Fetching all projects...");
      return await this.userService.apiRequest("GET", "projects"); // Changed to lowercase
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  /**
   * Retrieves a specific project by ID
   * @param id - Project identifier
   * @returns Promise containing project details
   */
  async getProject(id: string): Promise<Project> {
    try {
      console.log(`Fetching project with id: ${id}`);
      return await this.userService.apiRequest("GET", `projects/${id}`); // Changed to lowercase
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  }

  /**
   * Creates a new project with user verification
   * Process:
   * 1. Ensures user exists in database
   * 2. Gets Auth0 user information
   * 3. Retrieves database user with clean Auth0 ID
   * 4. Creates project with verified user ID
   * @param projectData - Project creation data
   * @returns Promise containing created project
   */
  async createProject(projectData: CreateProjectDto): Promise<Project> {
    try {
      // Step 1: Get Auth0 user information
      console.log("Getting Auth0 user info...");
      const auth0User = await this.userService.getAuth0UserInfo();

      // Step 2: Get database user with clean Auth0 ID
      console.log("Getting database user...");
      const dbUser = await this.userService.apiRequest(
        "GET",
        `users/by-auth0id/${auth0User.sub.split("|")[1]}` // Changed to lowercase
      );

      // Step 3: Create project with proper user ID
      const projectToCreate = {
        projectId: crypto.randomUUID(),
        name: projectData.name,
        description: projectData.description || "",
        createdAt: new Date().toISOString(),
        userId: dbUser, // Database user ID
      };

      console.log("Creating project with data:", projectToCreate);
      return await this.userService.apiRequest(
        "POST",
        "projects", // Changed to lowercase
        projectToCreate
      );
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  /**
   * Updates an existing project
   * @param id - Project identifier
   * @param projectData - Partial project data to update
   * @returns Promise containing updated project
   */
  async updateProject(
    id: string,
    projectData: Partial<CreateProjectDto>
  ): Promise<Project> {
    try {
      return await this.userService.apiRequest(
        "PUT",
        `projects/${id}`, // Changed to lowercase
        projectData
      );
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  /**
   * Deletes a project by ID
   * @param id - Project identifier
   */
  async deleteProject(id: string): Promise<void> {
    try {
      await this.userService.apiRequest("DELETE", `projects/${id}`); // Changed to lowercase
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }
}

// Factory function to create ProjectService instance
export const createProjectService = (getAccessTokenSilently: any) => {
  return new ProjectService(getAccessTokenSilently);
};