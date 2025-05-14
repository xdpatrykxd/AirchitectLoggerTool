using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server.Models;

/// <summary>
/// Represents a compressor entity with various properties and validation attributes.
/// </summary>
[Table("Compressors")]
public class Compressor
{
    [Column(name: "CompressorId")]
    [Required(ErrorMessage = "The ID is required.")]
    [Key]
    public Guid CompressorId { get; set; } = Guid.NewGuid();

    [Required(ErrorMessage = "The model is required.")]
    [Column(name: "Model")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "The model must be between 3 and 100 characters long.")]
    public string Model { get; set; } = string.Empty;

    [Required(ErrorMessage = "The capacity is required.")]
    [Column(name: "Capacity")]
    [Range(0.01, double.MaxValue, ErrorMessage = "The capacity must be greater than 0.")]
    public double Capacity { get; set; }

    public virtual ICollection<MeasurementData> Measurements { get; set; } = new List<MeasurementData>();

    [Required(ErrorMessage = "The project ID is required.")]
    [ForeignKey("ProjectId")]
    [Column(name: "ProjectId")]
    public Guid ProjectId { get; set; }

    [JsonIgnore]
    public Project? Project { get; set; }
}
