using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.Models;
using server.Services.Interfaces;

namespace server.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UserService> _logger;

    public UserService(ApplicationDbContext context, ILogger<UserService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<UserDto>> GetUsersAsync()
    {
        _logger.LogInformation("Fetching all users");
        var users = await _context.Users
            .Include(u => u.Projects)
            .ToListAsync();

        return users.Select(UserDto.FromUser);
    }

    public async Task<UserDto?> GetUserAsync(Guid id)
    {
        _logger.LogInformation("Fetching user with ID {UserId}", id);
        var user = await _context.Users
            .Include(u => u.Projects)
            .FirstOrDefaultAsync(u => u.UserId == id);

        return user == null ? null : UserDto.FromUser(user);
    }

    public async Task<Guid?> GetUserIdByAuth0IdAsync(string auth0Id)
    {
        _logger.LogInformation("Fetching user ID by Auth0 ID {Auth0Id}", auth0Id);
        return await _context.Users
            .Where(u => u.Auth0Id == auth0Id)
            .Select(u => (Guid?)u.UserId)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsByUserIdAsync(Guid userId)
    {
        _logger.LogInformation("Fetching all projects for user with ID {UserId}", userId);
        var projects = await _context.Projects
            .Include(p => p.Compressors)
            .Where(p => p.UserId == userId)
            .ToListAsync();

        return projects.Select(ProjectDto.FromProject);
    }

    public async Task<bool> UpdateUserAsync(Guid id, UpdateUserDto userDto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for update", id);
            return false;
        }

        userDto.UpdateUser(user);

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Updated user with ID {UserId}", id);
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserExists(id))
            {
                _logger.LogWarning("User with ID {UserId} not found during update", id);
                return false;
            }
            else
            {
                _logger.LogError("Concurrency error while updating user with ID {UserId}", id);
                throw;
            }
        }
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto userDto)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Auth0Id == userDto.Auth0Id);

        if (existingUser != null)
        {
            _logger.LogWarning("Attempted to create duplicate user with Auth0Id {Auth0Id}", userDto.Auth0Id);
            throw new InvalidOperationException($"User with Auth0Id {userDto.Auth0Id} already exists");
        }

        var user = userDto.ToUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created new user with ID {UserId}", user.UserId);
        return UserDto.FromUser(user);
    }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for deletion", id);
            return false;
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Deleted user with ID {UserId}", id);
        return true;
    }

    private bool UserExists(Guid id)
    {
        return _context.Users.Any(e => e.UserId == id);
    }
}
