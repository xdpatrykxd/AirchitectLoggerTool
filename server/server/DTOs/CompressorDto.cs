using System.ComponentModel.DataAnnotations;
using server.Models;

namespace server.DTOs;

public record CompressorDto
{
    public Guid CompressorId { get; private init; }
    public string Model { get; init; } = string.Empty;
    public double Capacity { get; init; }
    public Guid ProjectId { get; init; }
    public int MeasurementCount { get; init; }

    // Mapping method from Model to DTO
    public static CompressorDto FromCompressor(Compressor compressor) =>
        new()
        {
            CompressorId = compressor.CompressorId,
            Model = compressor.Model,
            Capacity = compressor.Capacity,
            ProjectId = compressor.ProjectId,
            MeasurementCount = compressor.Measurements?.Count ?? 0
        };
}

public record CreateCompressorDto
{
    [Required(ErrorMessage = "The model is required.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "The model must be between 3 and 100 characters.")]
    public string Model { get; init; } = string.Empty;

    [Required(ErrorMessage = "The capacity is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "The capacity must be greater than 0.")]
    public double Capacity { get; init; }

    [Required(ErrorMessage = "The project ID is required.")]
    public Guid ProjectId { get; init; }

    // Mapping method from DTO to Model
    public Compressor ToCompressor() =>
        new()
        {
            Model = Model,
            Capacity = Capacity,
            ProjectId = ProjectId
        };
}

public record UpdateCompressorDto
{
    [Required(ErrorMessage = "The model is required.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "The model must be between 3 and 100 characters.")]
    public string Model { get; init; } = string.Empty;

    [Required(ErrorMessage = "The capacity is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "The capacity must be greater than 0.")]
    public double Capacity { get; init; }

    // Mapping method to update an existing Compressor
    public void UpdateCompressor(Compressor compressor)
    {
        compressor.Model = Model;
        compressor.Capacity = Capacity;
    }
}
