using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server.Models;

/// <summary>
/// Represents a User entity with various properties and validation attributes.
/// </summary>
[Table("Users")]
public class User
{
    [Key]
    [Required(ErrorMessage = "The ID is required.")]
    [Column("UserId")]
    public Guid UserId { get; set; } = Guid.NewGuid();

    [Required(ErrorMessage = "The Auth0 ID is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The Auth0Id must be between 1 and 100 characters long.")]
    [Column("Auth0Id")]
    public string Auth0Id { get; set; } = string.Empty;

    [Required(ErrorMessage = "The name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The name must be between 1 and 100 characters long.")]
    [Column("Name")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "The given name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The given name must be between 1 and 100 characters long.")]
    [Column("GivenName")]
    public string GivenName { get; set; } = string.Empty;

    [Required(ErrorMessage = "The family name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The family name must be between 1 and 100 characters long.")]
    [Column("FamilyName")]
    public string FamilyName { get; set; } = string.Empty;

    [Required(ErrorMessage = "The nickname is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The nickname must be between 1 and 100 characters long.")]
    [Column("Nickname")]
    public string Nickname { get; set; } = string.Empty;

    [Required(ErrorMessage = "The email is required.")]
    [EmailAddress(ErrorMessage = "The email address is not valid.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "The E-Mail must be between 1 and 100 characters long.")]
    [Column("Email")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "The picture URL is required.")]
    [Url(ErrorMessage = "The picture URL is not valid.")]
    [StringLength(1000, MinimumLength = 1, ErrorMessage = "The Picture Url must be between 1 and 100 characters long.")]
    [Column("Picture")]
    public string Picture { get; set; } = string.Empty;

    [Required(ErrorMessage = "The email verified status is required.")]
    [Column("EmailVerified")]
    public bool EmailVerified { get; set; }

    [Required(ErrorMessage = "The created date is required.")]
    [Column("CreatedAt", TypeName = "timestamptz")]
    public DateTime CreatedAt { get; set; }

    [JsonIgnore] public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
}
