using server.DTOs;

namespace server.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetUsersAsync();
    Task<UserDto?> GetUserAsync(Guid id);
    Task<Guid?> GetUserIdByAuth0IdAsync(string auth0Id);
    Task<IEnumerable<ProjectDto>> GetProjectsByUserIdAsync(Guid userId);
    Task<bool> UpdateUserAsync(Guid id, UpdateUserDto userDto);
    Task<UserDto> CreateUserAsync(CreateUserDto userDto);
    Task<bool> DeleteUserAsync(Guid id);
}
