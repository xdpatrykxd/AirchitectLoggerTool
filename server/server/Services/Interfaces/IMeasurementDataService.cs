using server.DTOs;

namespace server.Services.Interfaces;

public interface IMeasurementDataService
{
    Task<IEnumerable<MeasurementDataDto>> GetMeasurementDataAsync();
    Task<MeasurementDataDto?> GetMeasurementDataByIdAsync(Guid id);
    Task<bool> UpdateMeasurementDataAsync(Guid id, UpdateMeasurementDataDto measurementDataDto);
    Task<MeasurementDataDto> CreateMeasurementDataAsync(CreateMeasurementDataDto measurementDataDto);
    Task<bool> DeleteMeasurementDataAsync(Guid id);
}
