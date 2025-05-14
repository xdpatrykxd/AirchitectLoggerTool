using System.ComponentModel.DataAnnotations;
using server.Models;

namespace server.DTOs;

/// <summary>
/// Data Transfer Object for Project.
/// </summary>
public record ProjectDto
{
    public Guid ProjectId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DateTime CreatedAt { get; init; }
    public Guid UserId { get; init; }
    public int CompressorCount { get; init; }

    /// <summary>
    /// Maps a Project model to a ProjectDto.
    /// </summary>
    /// <param name="project">The Project model.</param>
    /// <returns>A ProjectDto.</returns>
    public static ProjectDto FromProject(Project project) =>
        new()
        {
            ProjectId = project.ProjectId,
            Name = project.Name,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            UserId = project.UserId,
            CompressorCount = project.Compressors?.Count ?? 0
        };
}

/// <summary>
/// Data Transfer Object for creating Project.
/// </summary>
public record CreateProjectDto
{
    [Required(ErrorMessage = "The project name is required.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "The project name must be between 3 and 100 characters.")]
    public string Name { get; init; } = string.Empty;

    [StringLength(500, ErrorMessage = "The description can't exceed 500 characters.")]
    public string? Description { get; init; }

    [Required(ErrorMessage = "The user ID is required.")]
    public Guid UserId { get; init; }

    /// <summary>
    /// Maps a CreateProjectDto to a Project model.
    /// </summary>
    /// <returns>A Project model.</returns>
    public Project ToProject() =>
        new()
        {
            Name = Name,
            Description = Description,
            UserId = UserId,
            CreatedAt = DateTime.UtcNow // Automatically set at creation
        };
}

/// <summary>
/// Data Transfer Object for updating Project.
/// </summary>
public record UpdateProjectDto
{
    [Required(ErrorMessage = "The project name is required.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "The project name must be between 3 and 100 characters.")]
    public string Name { get; init; } = string.Empty;

    [StringLength(500, ErrorMessage = "The description can't exceed 500 characters.")]
    public string? Description { get; init; }

    /// <summary>
    /// Updates an existing Project model with the DTO values.
    /// </summary>
    /// <param name="project">The existing Project model.</param>
    public void UpdateProject(Project project)
    {
        project.Name = Name;
        project.Description = Description;
    }
}
