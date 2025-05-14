using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using server.Models;

namespace server.DTOs;

/// <summary>
/// Data Transfer Object for MeasurementData.
/// </summary>
public record MeasurementDataDto
{
    public Guid MeasurementDataId { get; init; }
    public JsonDocument Data { get; init; } = null!;
    public DateTime Timestamp { get; init; }
    public Guid CompressorId { get; init; }

    /// <summary>
    /// Maps a MeasurementData model to a MeasurementDataDto.
    /// </summary>
    /// <param name="measurementData">The MeasurementData model.</param>
    /// <returns>A MeasurementDataDto.</returns>
    public static MeasurementDataDto FromMeasurementData(MeasurementData measurementData) =>
        new()
        {
            MeasurementDataId = measurementData.MeasurementDataId,
            Data = measurementData.Data,
            Timestamp = measurementData.Timestamp,
            CompressorId = measurementData.CompressorId
        };
}

/// <summary>
/// Data Transfer Object for creating MeasurementData.
/// </summary>
public record CreateMeasurementDataDto
{
    [Required(ErrorMessage = "The data is required.")]
    public JsonDocument Data { get; init; } = null!;

    [Required(ErrorMessage = "The timestamp is required.")]
    [DataType(DataType.DateTime)]
    public DateTime Timestamp { get; init; }

    [Required(ErrorMessage = "The compressor ID is required.")]
    public Guid CompressorId { get; init; }

    /// <summary>
    /// Maps a CreateMeasurementDataDto to a MeasurementData model.
    /// </summary>
    /// <returns>A MeasurementData model.</returns>
    public MeasurementData ToMeasurementData() =>
        new()
        {
            Data = Data,
            Timestamp = Timestamp,
            CompressorId = CompressorId
        };
}

/// <summary>
/// Data Transfer Object for updating MeasurementData.
/// </summary>
public record UpdateMeasurementDataDto
{
    [Required(ErrorMessage = "The data is required.")]
    public JsonDocument Data { get; init; } = null!;

    [Required(ErrorMessage = "The timestamp is required.")]
    [DataType(DataType.DateTime)]
    public DateTime Timestamp { get; init; }

    /// <summary>
    /// Maps an UpdateMeasurementDataDto to an existing MeasurementData model.
    /// </summary>
    /// <param name="measurementData">The existing MeasurementData model.</param>
    public void UpdateMeasurementData(MeasurementData measurementData)
    {
        measurementData.Data = Data;
        measurementData.Timestamp = Timestamp;
    }
}
