using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Services.Interfaces;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;
    private readonly ILogger<ProjectsController> _logger;

    public ProjectsController(IProjectService projectService, ILogger<ProjectsController> logger)
    {
        _projectService = projectService;
        _logger = logger;
    }

    // GET: api/Projects
    [HttpGet]
    [Authorize(Policy = "read:projects")]
    [ProducesResponseType(typeof(IEnumerable<ProjectDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
    {
        try
        {
            _logger.LogInformation("Fetching all projects");
            var projects = await _projectService.GetProjectsAsync();

            _logger.LogInformation("Successfully retrieved {Count} projects", projects.Count());
            return Ok(projects);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving projects");
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving projects data");
        }
    }

    // GET: api/Projects/5
    [HttpGet("{id:guid}")]
    [Authorize(Policy = "read:projects")]
    [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ProjectDto>> GetProject(Guid id)
    {
        try
        {
            _logger.LogInformation("Fetching project with ID {ProjectId}", id);
            var project = await _projectService.GetProjectAsync(id);

            if (project == null)
            {
                _logger.LogWarning("Project with ID {ProjectId} not found", id);
                return NotFound($"Project with ID {id} not found");
            }

            _logger.LogInformation("Successfully retrieved project with ID {ProjectId}", id);
            return Ok(project);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving project with ID {ProjectId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving project data");
        }
    }

    // GET: api/Projects/5/Compressors
    [HttpGet("{id:guid}/Compressors")]
    [Authorize(Policy = "read:projects")]
    [ProducesResponseType(typeof(IEnumerable<CompressorDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<CompressorDto>>> GetCompressorsByProjectId(Guid id)
    {
        try
        {
            _logger.LogInformation("Fetching all compressors for project with ID {ProjectId}", id);
            var compressors = await _projectService.GetCompressorsByProjectIdAsync(id);

            if (!compressors.Any())
            {
                _logger.LogWarning("No compressors found for project with ID {ProjectId}", id);
                return NotFound($"No compressors found for project with ID {id}");
            }

            _logger.LogInformation("Successfully retrieved {Count} compressors for project with ID {ProjectId}",
                compressors.Count(), id);
            return Ok(compressors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving compressors for project with ID {ProjectId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving compressors data");
        }
    }

    // PUT: api/Projects/5
    [HttpPut("{id:guid}")]
    [Authorize(Policy = "write:projects")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PutProject(Guid id, UpdateProjectDto projectDto)
    {
        try
        {
            if (projectDto == null)
            {
                _logger.LogWarning("Update project failed: request body is null");
                return BadRequest("Request body cannot be null");
            }

            _logger.LogInformation("Updating project with ID {ProjectId}", id);
            var result = await _projectService.UpdateProjectAsync(id, projectDto);

            if (!result)
            {
                _logger.LogWarning("Project with ID {ProjectId} not found for update", id);
                return NotFound($"Project with ID {id} not found");
            }

            _logger.LogInformation("Successfully updated project with ID {ProjectId}", id);
            return NoContent();
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation failed for project update with ID {ProjectId}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating project with ID {ProjectId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error updating project");
        }
    }

    // POST: api/Projects
    [HttpPost]
    [Authorize(Policy = "write:projects")]
    [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ProjectDto>> PostProject(CreateProjectDto projectDto)
    {
        try
        {
            if (projectDto == null)
            {
                _logger.LogWarning("Create project failed: request body is null");
                return BadRequest("Request body cannot be null");
            }

            _logger.LogInformation("Creating new project");
            var createdProject = await _projectService.CreateProjectAsync(projectDto);

            _logger.LogInformation("Successfully created new project with ID {ProjectId}",
                createdProject.ProjectId);

            return CreatedAtAction(
                nameof(GetProject),
                new { id = createdProject.ProjectId },
                createdProject
            );
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation failed for project creation");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating new project");
            return StatusCode(StatusCodes.Status500InternalServerError, "Error creating project");
        }
    }

    // DELETE: api/Projects/5
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "write:projects")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        try
        {
            _logger.LogInformation("Attempting to delete project with ID {ProjectId}", id);
            var result = await _projectService.DeleteProjectAsync(id);

            if (!result)
            {
                _logger.LogWarning("Project with ID {ProjectId} not found for deletion", id);
                return NotFound($"Project with ID {id} not found");
            }

            _logger.LogInformation("Successfully deleted project with ID {ProjectId}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting project with ID {ProjectId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting project");
        }
    }
}
