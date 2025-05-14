using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using server.Data;
using server.DTOs;
using server.Models;
using server.Services.Interfaces;

namespace server.Services;

public class CompressorService : ICompressorService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CompressorService> _logger;

    public CompressorService(ApplicationDbContext context, ILogger<CompressorService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<CompressorDto>> GetCompressorsAsync()
    {
        _logger.LogInformation("Fetching all compressors");
        var compressors = await _context.Compressors
            .Include(c => c.Measurements)
            .ToListAsync();

        return compressors.Select(CompressorDto.FromCompressor);
    }

    public async Task<CompressorDto?> GetCompressorAsync(Guid id)
    {
        _logger.LogInformation("Fetching compressor with ID {CompressorId}", id);
        var compressor = await _context.Compressors
            .Include(c => c.Measurements)
            .FirstOrDefaultAsync(c => c.CompressorId == id);

        return compressor == null ? null : CompressorDto.FromCompressor(compressor);
    }

    public async Task<IEnumerable<MeasurementData>> GetMeasurementsDataByCompressorIdAsync(Guid compressorId)
    {
        _logger.LogInformation("Fetching all measurement data for compressor with ID {CompressorId}", compressorId);
        return await _context.MeasurementsData
            .Where(md => md.CompressorId == compressorId)
            .ToListAsync();
    }

    public async Task<bool> UpdateCompressorAsync(Guid id, UpdateCompressorDto compressorDto)
    {
        var compressor = await _context.Compressors.FindAsync(id);
        if (compressor == null)
        {
            _logger.LogWarning("Compressor with ID {CompressorId} not found for update", id);
            return false;
        }

        compressorDto.UpdateCompressor(compressor);

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Updated compressor with ID {CompressorId}", id);
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CompressorExists(id))
            {
                _logger.LogWarning("Compressor with ID {CompressorId} not found during update", id);
                return false;
            }
            else
            {
                _logger.LogError("Concurrency error while updating compressor with ID {CompressorId}", id);
                throw;
            }
        }
    }

    public async Task<CompressorDto> CreateCompressorAsync(CreateCompressorDto compressorDto)
    {
        var compressor = compressorDto.ToCompressor();

        _context.Compressors.Add(compressor);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created new compressor with ID {CompressorId}", compressor.CompressorId);

        return CompressorDto.FromCompressor(compressor);
    }

    public async Task<bool> DeleteCompressorAsync(Guid id)
    {
        var compressor = await _context.Compressors.FindAsync(id);
        if (compressor == null)
        {
            _logger.LogWarning("Compressor with ID {CompressorId} not found for deletion", id);
            return false;
        }

        _context.Compressors.Remove(compressor);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Deleted compressor with ID {CompressorId}", id);
        return true;
    }

    private bool CompressorExists(Guid id)
    {
        return _context.Compressors.Any(e => e.CompressorId == id);
    }
}
