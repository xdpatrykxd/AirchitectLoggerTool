// src/types.ts

// User-gerelateerde types
export interface User {
  auth0Id: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified: boolean;
  updatedAt: Date;
  createdAt?: Date;
  lastLoginAt?: Date;
}

// Project-gerelateerde types
export interface Project {
  projectId: string; // Changed from 'id' to 'projectId' to match backend
  name: string;
  description?: string;
  createdAt: string;
  userId: string; // Changed from 'ownerId' to 'userId' to match backend
}

export interface CreateProjectDto {
  name: string;
  createdAt: Date;
  userId: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Type voor de project lijst weergave
export interface ProjectListItem
  extends Pick<Project, "projectId" | "name" | "createdAt"> {
  owner: Pick<User, "name" | "email">;
}

// Pagination types
export interface PaginationParams {
  page: number;
  perPage: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// Auth-gerelateerde types
export interface AuthUser extends User {
  sub: string;
  email_verified: boolean;
  updated_at: string;
}

// Dialog props types
export interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  error?: string | null;
}

export interface CreateProjectDialogProps extends ProjectDialogProps {
  onSubmit: (projectData: CreateProjectDto) => Promise<void>;
}

export interface EditProjectDialogProps extends ProjectDialogProps {
  onSave: (name: string) => Promise<void>;
  initialName: string;
}
