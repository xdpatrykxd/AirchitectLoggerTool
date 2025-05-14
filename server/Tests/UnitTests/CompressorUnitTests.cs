using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
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
    public class CompressorServiceTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly CompressorService _compressorService;

        public CompressorServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);
            Mock<ILogger<CompressorService>> loggerMock = new();
            _compressorService = new CompressorService(_context, loggerMock.Object);
        }

        private void ClearDatabase()
        {
            _context.Compressors.RemoveRange(_context.Compressors);
            _context.MeasurementsData.RemoveRange(_context.MeasurementsData);
            _context.SaveChanges();
        }

        [Fact]
        public async Task GetCompressorsAsync_ReturnsAllCompressors()
        {
            // Arrange
            ClearDatabase();
            _context.Compressors.Add(new Compressor { CompressorId = Guid.NewGuid(), Model = "Model1", Capacity = 10, ProjectId = Guid.NewGuid() });
            _context.Compressors.Add(new Compressor { CompressorId = Guid.NewGuid(), Model = "Model2", Capacity = 20, ProjectId = Guid.NewGuid() });
            await _context.SaveChangesAsync();

            // Act
            var result = await _compressorService.GetCompressorsAsync();

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetCompressorAsync_ReturnsCompressor()
        {
            // Arrange
            ClearDatabase();
            var compressorId = Guid.NewGuid();
            _context.Compressors.Add(new Compressor { CompressorId = compressorId, Model = "Model1", Capacity = 10, ProjectId = Guid.NewGuid() });
            await _context.SaveChangesAsync();

            // Act
            var result = await _compressorService.GetCompressorAsync(compressorId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(compressorId, result.CompressorId);
        }

        [Fact]
        public async Task CreateCompressorAsync_AddsCompressor()
        {
            // Arrange
            ClearDatabase();
            var createCompressorDto = new CreateCompressorDto
            {
                Model = "Model1",
                Capacity = 10,
                ProjectId = Guid.NewGuid()
            };

            // Act
            var result = await _compressorService.CreateCompressorAsync(createCompressorDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(createCompressorDto.Model, result.Model);
            Assert.Equal(1, _context.Compressors.Count());
        }

        [Fact]
        public async Task UpdateCompressorAsync_UpdatesCompressor()
        {
            // Arrange
            ClearDatabase();
            var compressorId = Guid.NewGuid();
            var compressor = new Compressor { CompressorId = compressorId, Model = "Model1", Capacity = 10, ProjectId = Guid.NewGuid() };
            _context.Compressors.Add(compressor);
            await _context.SaveChangesAsync();

            var updateCompressorDto = new UpdateCompressorDto
            {
                Model = "UpdatedModel",
                Capacity = 20
            };

            // Act
            var result = await _compressorService.UpdateCompressorAsync(compressorId, updateCompressorDto);

            // Assert
            Assert.True(result);
            var updatedCompressor = await _context.Compressors.FindAsync(compressorId);
            if (updatedCompressor != null) Assert.Equal("UpdatedModel", updatedCompressor.Model);
        }

        [Fact]
        public async Task DeleteCompressorAsync_DeletesCompressor()
        {
            // Arrange
            ClearDatabase();
            var compressorId = Guid.NewGuid();
            var compressor = new Compressor { CompressorId = compressorId, Model = "Model1", Capacity = 10, ProjectId = Guid.NewGuid() };
            _context.Compressors.Add(compressor);
            await _context.SaveChangesAsync();

            // Act
            var result = await _compressorService.DeleteCompressorAsync(compressorId);

            // Assert
            Assert.True(result);
            Assert.Null(await _context.Compressors.FindAsync(compressorId));
        }

        [Fact]
        public async Task GetMeasurementsDataByCompressorIdAsync_ReturnsMeasurements()
        {
            // Arrange
            ClearDatabase();
            var compressorId = Guid.NewGuid();
            _context.MeasurementsData.Add(new MeasurementData { MeasurementDataId = Guid.NewGuid(), CompressorId = compressorId, DataJson = "" });
            _context.MeasurementsData.Add(new MeasurementData { MeasurementDataId = Guid.NewGuid(), CompressorId = compressorId, DataJson = "" });
            await _context.SaveChangesAsync();

            // Act
            var result = await _compressorService.GetMeasurementsDataByCompressorIdAsync(compressorId);

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetCompressorAsync_ReturnsNullForNonExistentCompressor()
        {
            // Arrange
            ClearDatabase();
            var nonExistentCompressorId = Guid.NewGuid();

            // Act
            var result = await _compressorService.GetCompressorAsync(nonExistentCompressorId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateCompressorAsync_ReturnsFalseForMismatchedIds()
        {
            // Arrange
            ClearDatabase();
            var compressorId = Guid.NewGuid();
            var compressor = new Compressor { CompressorId = compressorId, Model = "Model1", Capacity = 10, ProjectId = Guid.NewGuid() };
            _context.Compressors.Add(compressor);
            await _context.SaveChangesAsync();

            var mismatchedId = Guid.NewGuid();
            var updateCompressorDto = new UpdateCompressorDto
            {
                Model = "UpdatedModel",
                Capacity = 20
            };

            // Act
            var result = await _compressorService.UpdateCompressorAsync(mismatchedId, updateCompressorDto);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task DeleteCompressorAsync_ReturnsFalseForNonExistentCompressor()
        {
            // Arrange
            ClearDatabase();
            var nonExistentCompressorId = Guid.NewGuid();

            // Act
            var result = await _compressorService.DeleteCompressorAsync(nonExistentCompressorId);

            // Assert
            Assert.False(result);
        }

        public void Dispose()
        {
            ClearDatabase();
            _context.Dispose();
        }
    }
}
