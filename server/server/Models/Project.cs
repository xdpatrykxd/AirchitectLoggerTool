using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server.Models;

/// <summary>
/// Represents a Project entity with various properties and validation attributes.
/// </summary>
[Table("Projects")]
public class Project
{
    [Key]
    [Required(ErrorMessage = "The ID is required.")]
    [Column("ProjectId")]
    public Guid ProjectId { get; set; } = Guid.NewGuid();

    [Required(ErrorMessage = "The project name is required.")]
    [Column("Name")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "The project name must be between 3 and 100 characters long.")]
    public string Name { get; set; } = string.Empty;

    [Column("Description")]
    [StringLength(500, ErrorMessage = "The description can't exceed 500 characters.")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "The created date is required.")]
    [Column("CreatedAt", TypeName = "timestamptz")]
    public DateTime CreatedAt { get; set; }

    [Required(ErrorMessage = "The user ID is required.")]
    [ForeignKey("UserId")]
    [Column("UserId")]
    public Guid UserId { get; set; }

    // Navigation property for related user
    // Break the loop by ignoring this during serialization
    [JsonIgnore] public virtual User? User { get; set; }
    [JsonIgnore] public virtual ICollection<Compressor> Compressors { get; set; } = new List<Compressor>();
}
