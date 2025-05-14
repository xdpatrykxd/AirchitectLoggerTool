using System.ComponentModel.DataAnnotations;
using server.Models;

namespace server.DTOs;

/// <summary>
/// Data Transfer Object for User.
/// </summary>
public record UserDto
{
    public Guid UserId { get; init; }
    public string Auth0Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string GivenName { get; init; } = string.Empty;
    public string FamilyName { get; init; } = string.Empty;
    public string Nickname { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Picture { get; init; } = string.Empty;
    public bool EmailVerified { get; init; }
    public DateTime CreatedAt { get; init; }
    public int ProjectCount { get; init; }

    /// <summary>
    /// Maps a User model to a UserDto.
    /// </summary>
    /// <param name="user">The User model.</param>
    /// <returns>A UserDto.</returns>
    public static UserDto FromUser(User user) =>
        new()
        {
            UserId = user.UserId,
            Auth0Id = user.Auth0Id,
            Name = user.Name,
            GivenName = user.GivenName,
            FamilyName = user.FamilyName,
            Nickname = user.Nickname,
            Email = user.Email,
            Picture = user.Picture,
            EmailVerified = user.EmailVerified,
            CreatedAt = user.CreatedAt,
            ProjectCount = user.Projects?.Count ?? 0
        };
}

/// <summary>
/// Data Transfer Object for creating User.
/// </summary>
public record CreateUserDto
{
    [Required(ErrorMessage = "The Auth0 ID is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The Auth0 ID must be between 1 and 100 characters.")]
    public string Auth0Id { get; init; } = string.Empty;

    [Required(ErrorMessage = "The name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The name must be between 1 and 100 characters.")]
    public string Name { get; init; } = string.Empty;

    [Required(ErrorMessage = "The given name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The given name must be between 1 and 100 characters.")]
    public string GivenName { get; init; } = string.Empty;

    [Required(ErrorMessage = "The family name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The family name must be between 1 and 100 characters.")]
    public string FamilyName { get; init; } = string.Empty;

    [Required(ErrorMessage = "The nickname is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The nickname must be between 1 and 100 characters.")]
    public string Nickname { get; init; } = string.Empty;

    [Required(ErrorMessage = "The email is required.")]
    [EmailAddress(ErrorMessage = "The email address is not valid.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The email must be between 1 and 100 characters.")]
    public string Email { get; init; } = string.Empty;

    [Required(ErrorMessage = "The picture URL is required.")]
    [Url(ErrorMessage = "The picture URL is not valid.")]
    [StringLength(1000, MinimumLength = 1, ErrorMessage = "The picture URL must be between 1 and 1000 characters.")]
    public string Picture { get; init; } = string.Empty;

    [Required(ErrorMessage = "The email verified status is required.")]
    public bool EmailVerified { get; init; }

    /// <summary>
    /// Maps a CreateUserDto to a User model.
    /// </summary>
    /// <returns>A User model.</returns>
    public User ToUser() =>
        new()
        {
            Auth0Id = Auth0Id,
            Name = Name,
            GivenName = GivenName,
            FamilyName = FamilyName,
            Nickname = Nickname,
            Email = Email,
            Picture = Picture,
            EmailVerified = EmailVerified,
            CreatedAt = DateTime.UtcNow // Automatically set at creation
        };
}

/// <summary>
/// Data Transfer Object for updating User.
/// </summary>
public record UpdateUserDto
{
    [Required(ErrorMessage = "The name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The name must be between 1 and 100 characters.")]
    public string Name { get; init; } = string.Empty;

    [Required(ErrorMessage = "The given name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The given name must be between 1 and 100 characters.")]
    public string GivenName { get; init; } = string.Empty;

    [Required(ErrorMessage = "The family name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The family name must be between 1 and 100 characters.")]
    public string FamilyName { get; init; } = string.Empty;

    [Required(ErrorMessage = "The nickname is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The nickname must be between 1 and 100 characters.")]
    public string Nickname { get; init; } = string.Empty;

    [Required(ErrorMessage = "The picture URL is required.")]
    [Url(ErrorMessage = "The picture URL is not valid.")]
    [StringLength(1000, MinimumLength = 1, ErrorMessage = "The picture URL must be between 1 and 1000 characters.")]
    public string Picture { get; init; } = string.Empty;

    /// <summary>
    /// Updates an existing User model with the DTO values.
    /// </summary>
    /// <param name="user">The existing User model.</param>
    public void UpdateUser(User user)
    {
        user.Name = Name;
        user.GivenName = GivenName;
        user.FamilyName = FamilyName;
        user.Nickname = Nickname;
        user.Picture = Picture;
    }
}
