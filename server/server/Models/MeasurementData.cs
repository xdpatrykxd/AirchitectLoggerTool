using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace server.Models;

/// <summary>
/// Represents measurement data entity with various properties and validation attributes.
/// </summary>
[Table("MeasurementsData")]
public class MeasurementData
{
    [Column(name: "MeasurementDataId")]
    [Required(ErrorMessage = "The ID is required.")]
    [Key]
    public Guid MeasurementDataId { get; set; } = Guid.NewGuid();

    [Required(ErrorMessage = "The value is required.")]
    [Column(name: "data", TypeName = "jsonb")]
    public string DataJson { get; set; } = "{}";

    [NotMapped]
    public JsonDocument Data
    {
        get => JsonDocument.Parse(DataJson);
        set => DataJson = JsonSerializer.Serialize(value);
    }

    [Required(ErrorMessage = "The timestamp is required.")]
    [Column(name: "Timestamp", TypeName = "timestamptz")]
    [DataType(DataType.DateTime)]
    [CustomValidation(typeof(MeasurementData), nameof(ValidateTimestamp))]
    public DateTime Timestamp { get; set; }

    [Required(ErrorMessage = "The compressor ID is required.")]
    [ForeignKey("CompressorId")]
    [Column(name: "CompressorId")]
    public Guid CompressorId { get; set; }

    public virtual Compressor? Compressor { get; set; }

    public static ValidationResult? ValidateTimestamp(DateTime timestamp, ValidationContext context)
    {
        if (timestamp > DateTime.UtcNow)
        {
            return new ValidationResult("The timestamp cannot be in the future.");
        }
        return ValidationResult.Success;
    }
}
