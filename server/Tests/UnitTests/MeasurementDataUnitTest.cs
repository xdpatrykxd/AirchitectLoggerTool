using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using server.Data;
using server.DTOs;
using server.Models;
using server.Services;
using Xunit;

namespace Tests.UnitTests
{
    public class MeasurementDataUnitTest : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly MeasurementDataService _measurementDataService;

        public MeasurementDataUnitTest()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);
            Mock<ILogger<MeasurementDataService>> loggerMock = new();
            _measurementDataService = new MeasurementDataService(_context, loggerMock.Object);
        }

        private void ClearDatabase()
        {
            _context.MeasurementsData.RemoveRange(_context.MeasurementsData);
            _context.SaveChanges();
        }

        [Fact]
        public async Task GetMeasurementDataAsync_ReturnsAllMeasurementData()
        {
            // Arrange
            ClearDatabase();
            _context.MeasurementsData.Add(new MeasurementData { MeasurementDataId = Guid.NewGuid(), DataJson = "{}", Timestamp = DateTime.UtcNow, CompressorId = Guid.NewGuid() });
            _context.MeasurementsData.Add(new MeasurementData { MeasurementDataId = Guid.NewGuid(), DataJson = "{}", Timestamp = DateTime.UtcNow, CompressorId = Guid.NewGuid() });
            await _context.SaveChangesAsync();

            // Act
            var result = await _measurementDataService.GetMeasurementDataAsync();

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetMeasurementDataByIdAsync_ReturnsMeasurementData()
        {
            // Arrange
            ClearDatabase();
            var measurementDataId = Guid.NewGuid();
            _context.MeasurementsData.Add(new MeasurementData { MeasurementDataId = measurementDataId, DataJson = "{}", Timestamp = DateTime.UtcNow, CompressorId = Guid.NewGuid() });
            await _context.SaveChangesAsync();

            // Act
            var result = await _measurementDataService.GetMeasurementDataByIdAsync(measurementDataId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(measurementDataId, result.MeasurementDataId);
        }

        [Fact]
        public async Task UpdateMeasurementDataAsync_UpdatesMeasurementData()
        {
            // Arrange
            ClearDatabase();
            var measurementDataId = Guid.NewGuid();
            var measurementData = new MeasurementData { MeasurementDataId = measurementDataId, DataJson = "{}", Timestamp = DateTime.UtcNow, CompressorId = Guid.NewGuid() };
            _context.MeasurementsData.Add(measurementData);
            await _context.SaveChangesAsync();

            var updateMeasurementDataDto = new UpdateMeasurementDataDto
            {
                Data = JsonDocument.Parse("{}"),
                Timestamp = DateTime.UtcNow
            };

            // Act
            var result = await _measurementDataService.UpdateMeasurementDataAsync(measurementDataId, updateMeasurementDataDto);

            // Assert
            Assert.True(result);
            var updatedMeasurementData = await _context.MeasurementsData.FindAsync(measurementDataId);
            if (updatedMeasurementData != null) Assert.Equal("{}", updatedMeasurementData.DataJson);
        }

        [Fact]
        public async Task DeleteMeasurementDataAsync_DeletesMeasurementData()
        {
            // Arrange
            ClearDatabase();
            var measurementDataId = Guid.NewGuid();
            var measurementData = new MeasurementData { MeasurementDataId = measurementDataId, DataJson = "{}", Timestamp = DateTime.UtcNow, CompressorId = Guid.NewGuid() };
            _context.MeasurementsData.Add(measurementData);
            await _context.SaveChangesAsync();

            // Act
            var result = await _measurementDataService.DeleteMeasurementDataAsync(measurementDataId);

            // Assert
            Assert.True(result);
            Assert.Null(await _context.MeasurementsData.FindAsync(measurementDataId));
        }

        [Fact]
        public async Task GetMeasurementDataByIdAsync_ReturnsNullForNonExistentMeasurementData()
        {
            // Arrange
            ClearDatabase();
            var nonExistentMeasurementDataId = Guid.NewGuid();

            // Act
            var result = await _measurementDataService.GetMeasurementDataByIdAsync(nonExistentMeasurementDataId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateMeasurementDataAsync_ReturnsFalseForMismatchedIds()
        {
            // Arrange
            ClearDatabase();
            var measurementDataId = Guid.NewGuid();
            var measurementData = new MeasurementData { MeasurementDataId = measurementDataId, DataJson = "{}", Timestamp = DateTime.UtcNow, CompressorId = Guid.NewGuid() };
            _context.MeasurementsData.Add(measurementData);
            await _context.SaveChangesAsync();

            var mismatchedId = Guid.NewGuid();
            var updateMeasurementDataDto = new UpdateMeasurementDataDto
            {
                Data = JsonDocument.Parse("{}"),
                Timestamp = DateTime.UtcNow
            };

            // Act
            var result = await _measurementDataService.UpdateMeasurementDataAsync(mismatchedId, updateMeasurementDataDto);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task DeleteMeasurementDataAsync_ReturnsFalseForNonExistentMeasurementData()
        {
            // Arrange
            ClearDatabase();
            var nonExistentMeasurementDataId = Guid.NewGuid();

            // Act
            var result = await _measurementDataService.DeleteMeasurementDataAsync(nonExistentMeasurementDataId);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task CreateMeasurementDataAsync_ThrowsExceptionForInvalidData()
        {
            // Arrange
            ClearDatabase();
            var invalidMeasurementDataDto = new CreateMeasurementDataDto
            {
                Data = JsonDocument.Parse("{}"),
                Timestamp = DateTime.UtcNow.AddDays(1), // Future timestamp
                CompressorId = Guid.NewGuid()
            };

            // Act & Assert
            await Assert.ThrowsAsync<ValidationException>(() => _measurementDataService.CreateMeasurementDataAsync(invalidMeasurementDataDto));
        }

        [Fact]
        public async Task GetMeasurementDataAsync_ReturnsEmptyListWhenNoData()
        {
            // Arrange
            ClearDatabase();

            // Act
            var result = await _measurementDataService.GetMeasurementDataAsync();

            // Assert
            Assert.Empty(result);
        }

        public void Dispose()
        {
            ClearDatabase();
            _context.Dispose();
        }
    }
}
