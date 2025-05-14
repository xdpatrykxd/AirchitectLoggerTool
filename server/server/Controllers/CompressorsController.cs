using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Models;
using server.Services.Interfaces;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
public class CompressorsController : ControllerBase
{
    private readonly ICompressorService _compressorService;
    private readonly ILogger<CompressorsController> _logger;

    public CompressorsController(ICompressorService compressorService, ILogger<CompressorsController> logger)
    {
        _compressorService = compressorService;
        _logger = logger;
    }

    // GET: api/Compressors
    [HttpGet]
    [Authorize(Policy = "read:compressors")]
    [ProducesResponseType(typeof(IEnumerable<CompressorDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<CompressorDto>>> GetCompressors()
    {
        try
        {
            _logger.LogInformation("Fetching all compressors");
            var compressors = await _compressorService.GetCompressorsAsync();
            return Ok(compressors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving compressors");
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving compressors data");
        }
    }

    // GET: api/Compressors/5
    [HttpGet("{id:guid}")]
    [Authorize(Policy = "read:compressors")]
    [ProducesResponseType(typeof(CompressorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CompressorDto>> GetCompressor(Guid id)
    {
        try
        {
            _logger.LogInformation("Fetching compressor with ID {CompressorId}", id);
            var compressor = await _compressorService.GetCompressorAsync(id);

            if (compressor != null)
            {
                return Ok(compressor);
            }
            _logger.LogWarning("Compressor with ID {CompressorId} not found", id);
            return NotFound($"Compressor with ID {id} not found");

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving compressor with ID {CompressorId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving compressor data");
        }
    }

    // GET: api/Compressors/5/MeasurementsData
    [HttpGet("{id:guid}/MeasurementsData")]
    [Authorize(Policy = "read:compressors")]
    [ProducesResponseType(typeof(IEnumerable<MeasurementData>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<MeasurementData>>> GetMeasurementsDataByCompressorId(Guid id)
    {
        try
        {
            _logger.LogInformation("Fetching measurements data for compressor with ID {CompressorId}", id);
            var measurementsData = await _compressorService.GetMeasurementsDataByCompressorIdAsync(id);

            if (measurementsData.Any())
            {
                return Ok(measurementsData);
            }
            _logger.LogWarning("No measurement data found for compressor with ID {CompressorId}", id);
            return NotFound($"No measurement data found for compressor with ID {id}");

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving measurements data for compressor with ID {CompressorId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving measurements data");
        }
    }

    // PUT: api/Compressors/5
    [HttpPut("{id:guid}")]
    [Authorize(Policy = "write:compressors")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PutCompressor(Guid id, UpdateCompressorDto compressorDto)
    {
        try
        {
            if (compressorDto == null)
            {
                _logger.LogWarning("Update compressor failed: request body is null");
                return BadRequest("Request body cannot be null");
            }

            _logger.LogInformation("Updating compressor with ID {CompressorId}", id);
            var result = await _compressorService.UpdateCompressorAsync(id, compressorDto);

            if (!result)
            {
                _logger.LogWarning("Compressor with ID {CompressorId} not found for update", id);
                return NotFound($"Compressor with ID {id} not found");
            }

            _logger.LogInformation("Successfully updated compressor with ID {CompressorId}", id);
            return NoContent();
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation failed for compressor update with ID {CompressorId}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating compressor with ID {CompressorId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error updating compressor");
        }
    }

    // POST: api/Compressors
    [HttpPost]
    [Authorize(Policy = "write:compressors")]
    [ProducesResponseType(typeof(CompressorDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CompressorDto>> PostCompressor(CreateCompressorDto compressorDto)
    {
        try
        {
            if (compressorDto == null)
            {
                _logger.LogWarning("Create compressor failed: request body is null");
                return BadRequest("Request body cannot be null");
            }

            _logger.LogInformation("Creating new compressor");
            var createdCompressor = await _compressorService.CreateCompressorAsync(compressorDto);

            _logger.LogInformation("Successfully created new compressor with ID {CompressorId}",
                createdCompressor.CompressorId);

            return CreatedAtAction(
                nameof(GetCompressor),
                new { id = createdCompressor.CompressorId },
                createdCompressor
            );
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation failed for compressor creation");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating new compressor");
            return StatusCode(StatusCodes.Status500InternalServerError, "Error creating new compressor");
        }
    }

    // DELETE: api/Compressors/5
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "write:compressors")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteCompressor(Guid id)
    {
        try
        {
            _logger.LogInformation("Attempting to delete compressor with ID {CompressorId}", id);
            var result = await _compressorService.DeleteCompressorAsync(id);

            if (!result)
            {
                _logger.LogWarning("Compressor with ID {CompressorId} not found for deletion", id);
                return NotFound($"Compressor with ID {id} not found");
            }

            _logger.LogInformation("Successfully deleted compressor with ID {CompressorId}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting compressor with ID {CompressorId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting compressor");
        }
    }
}
