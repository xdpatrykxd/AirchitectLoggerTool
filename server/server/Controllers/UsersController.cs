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
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    // GET: api/Users
    [HttpGet]
    [Authorize(Policy = "read:users")]
    [ProducesResponseType(typeof(IEnumerable<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        try
        {
            _logger.LogInformation("Fetching all users");
            var users = await _userService.GetUsersAsync();

            _logger.LogInformation("Successfully retrieved {Count} users", users.Count());
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users");
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving users data");
        }
    }

    // GET: api/Users/5
    [HttpGet("{id:guid}")]
    [Authorize(Policy = "read:users")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UserDto>> GetUser(Guid id)
    {
        try
        {
            _logger.LogInformation("Fetching user with ID {UserId}", id);
            var user = await _userService.GetUserAsync(id);

            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found", id);
                return NotFound($"User with ID {id} not found");
            }

            _logger.LogInformation("Successfully retrieved user with ID {UserId}", id);
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user with ID {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving user data");
        }
    }

    // GET: api/Users/by-auth0id/auth0|123456789
    [HttpGet("by-auth0id/{auth0Id}")]
    [Authorize(Policy = "read:users")]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Guid>> GetUserIdByAuth0Id(string auth0Id)
    {
        try
        {
            _logger.LogInformation("Fetching user ID by Auth0 ID {Auth0Id}", auth0Id);
            var userId = await _userService.GetUserIdByAuth0IdAsync(auth0Id);

            if (!userId.HasValue)
            {
                _logger.LogWarning("User with Auth0 ID {Auth0Id} not found", auth0Id);
                return NotFound($"User with Auth0 ID {auth0Id} not found");
            }

            _logger.LogInformation("Successfully retrieved user ID for Auth0 ID {Auth0Id}", auth0Id);
            return Ok(userId.Value);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user ID for Auth0 ID {Auth0Id}", auth0Id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving user data");
        }
    }

    // GET: api/Users/5/Projects
    [HttpGet("{id:guid}/Projects")]
    [Authorize(Policy = "read:users")]
    [ProducesResponseType(typeof(IEnumerable<ProjectDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjectsByUserId(Guid id)
    {
        try
        {
            _logger.LogInformation("Fetching all projects for user with ID {UserId}", id);
            var projects = await _userService.GetProjectsByUserIdAsync(id);

            if (!projects.Any())
            {
                _logger.LogWarning("No projects found for user with ID {UserId}", id);
                return NotFound($"No projects found for user with ID {id}");
            }

            _logger.LogInformation("Successfully retrieved {Count} projects for user with ID {UserId}",
                projects.Count(), id);
            return Ok(projects);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving projects for user with ID {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving user projects data");
        }
    }

    // PUT: api/Users/5
    [HttpPut("{id:guid}")]
    [Authorize(Policy = "write:users")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PutUser(Guid id, UpdateUserDto userDto)
    {
        try
        {
            if (userDto == null)
            {
                _logger.LogWarning("Update user failed: request body is null");
                return BadRequest("Request body cannot be null");
            }

            _logger.LogInformation("Updating user with ID {UserId}", id);
            var result = await _userService.UpdateUserAsync(id, userDto);

            if (!result)
            {
                _logger.LogWarning("User with ID {UserId} not found for update", id);
                return NotFound($"User with ID {id} not found");
            }

            _logger.LogInformation("Successfully updated user with ID {UserId}", id);
            return NoContent();
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation failed for user update with ID {UserId}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user with ID {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error updating user");
        }
    }

    // POST: api/Users
    [HttpPost]
    [Authorize(Policy = "write:users")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UserDto>> PostUser(CreateUserDto userDto)
    {
        try
        {
            if (userDto == null)
            {
                _logger.LogWarning("Create user failed: request body is null");
                return BadRequest("Request body cannot be null");
            }

            _logger.LogInformation("Creating new user");
            var createdUser = await _userService.CreateUserAsync(userDto);

            _logger.LogInformation("Successfully created new user with ID {UserId}", createdUser.UserId);

            return CreatedAtAction(
                nameof(GetUser),
                new { id = createdUser.UserId },
                createdUser
            );
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Duplicate user creation attempt");
            return Conflict(ex.Message);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation failed for user creation");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating new user");
            return StatusCode(StatusCodes.Status500InternalServerError, "Error creating user");
        }
    }

    // DELETE: api/Users/5
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "write:users")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        try
        {
            _logger.LogInformation("Attempting to delete user with ID {UserId}", id);
            var result = await _userService.DeleteUserAsync(id);

            if (!result)
            {
                _logger.LogWarning("User with ID {UserId} not found for deletion", id);
                return NotFound($"User with ID {id} not found");
            }

            _logger.LogInformation("Successfully deleted user with ID {UserId}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user with ID {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting user");
        }
    }
}
