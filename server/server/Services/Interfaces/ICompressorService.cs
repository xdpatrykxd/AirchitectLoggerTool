using server.DTOs;
using server.Models;

namespace server.Services.Interfaces;

public interface ICompressorService
{
    Task<IEnumerable<CompressorDto>> GetCompressorsAsync();
    Task<CompressorDto?> GetCompressorAsync(Guid id);
    Task<IEnumerable<MeasurementData>> GetMeasurementsDataByCompressorIdAsync(Guid compressorId);
    Task<bool> UpdateCompressorAsync(Guid id, UpdateCompressorDto compressorDto);
    Task<CompressorDto> CreateCompressorAsync(CreateCompressorDto compressorDto);
    Task<bool> DeleteCompressorAsync(Guid id);
}
