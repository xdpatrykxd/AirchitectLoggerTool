using server.DTOs;

namespace server.Services.Interfaces;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetProjectsAsync();
    Task<ProjectDto?> GetProjectAsync(Guid id);
    Task<IEnumerable<CompressorDto>> GetCompressorsByProjectIdAsync(Guid projectId);
    Task<bool> UpdateProjectAsync(Guid id, UpdateProjectDto projectDto);
    Task<ProjectDto> CreateProjectAsync(CreateProjectDto projectDto);
    Task<bool> DeleteProjectAsync(Guid id);
}
