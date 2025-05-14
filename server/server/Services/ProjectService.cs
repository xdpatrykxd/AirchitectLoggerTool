using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.Services.Interfaces;

namespace server.Services;

public class ProjectService : IProjectService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProjectService> _logger;

    public ProjectService(ApplicationDbContext context, ILogger<ProjectService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsAsync()
    {
        _logger.LogInformation("Fetching all projects");
        var projects = await _context.Projects
            .Include(p => p.Compressors)
            .ToListAsync();

        return projects.Select(ProjectDto.FromProject);
    }

    public async Task<ProjectDto?> GetProjectAsync(Guid id)
    {
        _logger.LogInformation("Fetching project with ID {ProjectId}", id);
        var project = await _context.Projects
            .Include(p => p.Compressors)
            .FirstOrDefaultAsync(p => p.ProjectId == id);

        return project == null ? null : ProjectDto.FromProject(project);
    }

    public async Task<IEnumerable<CompressorDto>> GetCompressorsByProjectIdAsync(Guid projectId)
    {
        _logger.LogInformation("Fetching all compressors for project with ID {ProjectId}", projectId);
        var compressors = await _context.Compressors
            .Include(c => c.Measurements)
            .Where(c => c.ProjectId == projectId)
            .ToListAsync();

        return compressors.Select(CompressorDto.FromCompressor);
    }

    public async Task<bool> UpdateProjectAsync(Guid id, UpdateProjectDto projectDto)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
        {
            _logger.LogWarning("Project with ID {ProjectId} not found for update", id);
            return false;
        }

        projectDto.UpdateProject(project);

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Updated project with ID {ProjectId}", id);
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProjectExists(id))
            {
                _logger.LogWarning("Project with ID {ProjectId} not found during update", id);
                return false;
            }
            else
            {
                _logger.LogError("Concurrency error while updating project with ID {ProjectId}", id);
                throw;
            }
        }
    }

    public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto projectDto)
    {
        var project = projectDto.ToProject();

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created new project with ID {ProjectId}", project.ProjectId);

        return ProjectDto.FromProject(project);
    }

    public async Task<bool> DeleteProjectAsync(Guid id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
        {
            _logger.LogWarning("Project with ID {ProjectId} not found for deletion", id);
            return false;
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Deleted project with ID {ProjectId}", id);
        return true;
    }

    private bool ProjectExists(Guid id)
    {
        return _context.Projects.Any(e => e.ProjectId == id);
    }
}
