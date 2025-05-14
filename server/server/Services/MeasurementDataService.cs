using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.Services.Interfaces;

namespace server.Services;

public class MeasurementDataService : IMeasurementDataService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MeasurementDataService> _logger;

    public MeasurementDataService(ApplicationDbContext context, ILogger<MeasurementDataService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<MeasurementDataDto>> GetMeasurementDataAsync()
    {
        _logger.LogInformation("Fetching all measurement data");
        var measurements = await _context.MeasurementsData.ToListAsync();
        return measurements.Select(MeasurementDataDto.FromMeasurementData);
    }

    public async Task<MeasurementDataDto?> GetMeasurementDataByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching measurement data with ID {MeasurementDataId}", id);
        var measurementData = await _context.MeasurementsData.FindAsync(id);

        return measurementData == null ? null : MeasurementDataDto.FromMeasurementData(measurementData);
    }

    public async Task<bool> UpdateMeasurementDataAsync(Guid id, UpdateMeasurementDataDto measurementDataDto)
    {
        var measurementData = await _context.MeasurementsData.FindAsync(id);
        if (measurementData == null)
        {
            _logger.LogWarning("Measurement data with ID {MeasurementDataId} not found for update", id);
            return false;
        }

        // Valideer timestamp voordat we updaten
        if (measurementDataDto.Timestamp > DateTime.UtcNow)
        {
            _logger.LogWarning("Invalid timestamp (future) for measurement data with ID {MeasurementDataId}", id);
            return false;
        }

        measurementDataDto.UpdateMeasurementData(measurementData);

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Updated measurement data with ID {MeasurementDataId}", id);
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MeasurementDataExists(id))
            {
                _logger.LogWarning("Measurement data with ID {MeasurementDataId} not found during update", id);
                return false;
            }
            else
            {
                _logger.LogError("Concurrency error while updating measurement data with ID {MeasurementDataId}", id);
                throw;
            }
        }
    }

    public async Task<MeasurementDataDto> CreateMeasurementDataAsync(CreateMeasurementDataDto measurementDataDto)
    {
        // Valideer timestamp voordat we creëren
        if (measurementDataDto.Timestamp > DateTime.UtcNow)
        {
            throw new ValidationException("The timestamp cannot be in the future.");
        }

        var measurementData = measurementDataDto.ToMeasurementData();

        _context.MeasurementsData.Add(measurementData);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created new measurement data with ID {MeasurementDataId}", measurementData.MeasurementDataId);

        return MeasurementDataDto.FromMeasurementData(measurementData);
    }

    public async Task<bool> DeleteMeasurementDataAsync(Guid id)
    {
        var measurementData = await _context.MeasurementsData.FindAsync(id);
        if (measurementData == null)
        {
            _logger.LogWarning("Measurement data with ID {MeasurementDataId} not found for deletion", id);
            return false;
        }

        _context.MeasurementsData.Remove(measurementData);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Deleted measurement data with ID {MeasurementDataId}", id);
        return true;
    }

    private bool MeasurementDataExists(Guid id)
    {
        return _context.MeasurementsData.Any(e => e.MeasurementDataId == id);
    }
}
