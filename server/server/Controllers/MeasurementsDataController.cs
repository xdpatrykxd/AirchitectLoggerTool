using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Services.Interfaces;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
public class MeasurementsDataController : ControllerBase
{
    private readonly IMeasurementDataService _measurementDataService;
    private readonly ILogger<MeasurementsDataController> _logger;

    public MeasurementsDataController(IMeasurementDataService measurementDataService, ILogger<MeasurementsDataController> logger)
    {
        _measurementDataService = measurementDataService;
        _logger = logger;
    }

    // GET: api/MeasurementsData
    [HttpGet]
    [Authorize(Policy = "read:measurements")]
    [ProducesResponseType(typeof(IEnumerable<MeasurementDataDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<MeasurementDataDto>>> GetMeasurementData()
    {
        try
        {
            _logger.LogInformation("Fetching all measurement data");
            var measurementData = await _measurementDataService.GetMeasurementDataAsync();
            return Ok(measurementData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving measurement data");
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving measurement data");
        }
    }

    // GET: api/MeasurementsData/5
    [HttpGet("{id:guid}")]
    [Authorize(Policy = "read:measurements")]
    [ProducesResponseType(typeof(MeasurementDataDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MeasurementDataDto>> GetMeasurementData(Guid id)
    {
        try
        {
            _logger.LogInformation("Fetching measurement data with ID {MeasurementDataId}", id);
            var measurementData = await _measurementDataService.GetMeasurementDataByIdAsync(id);

            if (measurementData == null)
            {
                _logger.LogWarning("Measurement data with ID {MeasurementDataId} not found", id);
                return NotFound($"Measurement data with ID {id} not found");
            }

            return Ok(measurementData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving measurement data with ID {MeasurementDataId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving measurement data");
        }
    }

    // PUT: api/MeasurementsData/5
    [HttpPut("{id:guid}")]
    [Authorize(Policy = "write:measurements")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PutMeasurementData(Guid id, UpdateMeasurementDataDto measurementDataDto)
    {
        try
        {
            if (measurementDataDto == null)
            {
                _logger.LogWarning("Update measurement data failed: request body is null");
                return BadRequest("Request body cannot be null");
            }

            _logger.LogInformation("Updating measurement data with ID {MeasurementDataId}", id);
            var result = await _measurementDataService.UpdateMeasurementDataAsync(id, measurementDataDto);

            if (!result)
            {
                _logger.LogWarning("Measurement data with ID {MeasurementDataId} not found for update", id);
                return NotFound($"Measurement data with ID {id} not found");
            }

            _logger.LogInformation("Successfully updated measurement data with ID {MeasurementDataId}", id);
            return NoContent();
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation failed for measurement data update with ID {MeasurementDataId}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating measurement data with ID {MeasurementDataId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error updating measurement data");
        }
    }

    // POST: api/MeasurementsData
    [HttpPost]
    [Authorize(Policy = "write:measurements")]
    [ProducesResponseType(typeof(MeasurementDataDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MeasurementDataDto>> PostMeasurementData(CreateMeasurementDataDto measurementDataDto)
    {
        try
        {
            if (measurementDataDto == null)
            {
                _logger.LogWarning("Create measurement data failed: request body is null");
                return BadRequest("Request body cannot be null");
            }

            _logger.LogInformation("Creating new measurement data");
            var createdMeasurementData = await _measurementDataService.CreateMeasurementDataAsync(measurementDataDto);

            _logger.LogInformation("Successfully created new measurement data with ID {MeasurementDataId}",
                createdMeasurementData.MeasurementDataId);

            return CreatedAtAction(
                nameof(GetMeasurementData),
                new { id = createdMeasurementData.MeasurementDataId },
                createdMeasurementData
            );
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation failed for measurement data creation");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating new measurement data");
            return StatusCode(StatusCodes.Status500InternalServerError, "Error creating new measurement data");
        }
    }

    // DELETE: api/MeasurementsData/5
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "write:measurements")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteMeasurementData(Guid id)
    {
        try
        {
            _logger.LogInformation("Attempting to delete measurement data with ID {MeasurementDataId}", id);
            var result = await _measurementDataService.DeleteMeasurementDataAsync(id);

            if (!result)
            {
                _logger.LogWarning("Measurement data with ID {MeasurementDataId} not found for deletion", id);
                return NotFound($"Measurement data with ID {id} not found");
            }

            _logger.LogInformation("Successfully deleted measurement data with ID {MeasurementDataId}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting measurement data with ID {MeasurementDataId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting measurement data");
        }
    }
}
