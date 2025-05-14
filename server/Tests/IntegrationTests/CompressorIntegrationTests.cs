using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using server.Models;
using Xunit;

namespace Tests.IntegrationTests
{
    public class CompressorIntegrationTests
    {
        private readonly HttpClient _client;
        private readonly string _token;

        public CompressorIntegrationTests()
        {
            var baseAddress = new Uri("http://localhost:5053");
            _client = new HttpClient { BaseAddress = baseAddress };
            _token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im9SblFNdjd1NlZSbHBIOUgzaUtrayJ9.eyJpc3MiOiJodHRwczovL2Rldi02c3d0enBnYmNsN2toYXAxLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJIY2w2ekFtZWhQTTQ0eGJLU2FqZERVcGszcEppeEowR0BjbGllbnRzIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MDUzL2FwaS9Vc2VycyIsImlhdCI6MTczNTIzNjE3NiwiZXhwIjoxNzM1MzIyNTc2LCJzY29wZSI6InJlYWQ6dXNlcnMgd3JpdGU6dXNlcnMgYWRtaW4gcmVhZDpjb21wcmVzc29ycyB3cml0ZTpjb21wcmVzc29ycyByZWFkOnByb2plY3RzIHdyaXRlOnByb2plY3RzIHJlYWQ6bWVhc3VyZW1lbnRzIHdyaXRlOm1lYXN1cmVtZW50cyByZWFkOm1lc3NhZ2VzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoiSGNsNnpBbWVoUE00NHhiS1NhamREVXBrM3BKaXhKMEciLCJwZXJtaXNzaW9ucyI6WyJyZWFkOnVzZXJzIiwid3JpdGU6dXNlcnMiLCJhZG1pbiIsInJlYWQ6Y29tcHJlc3NvcnMiLCJ3cml0ZTpjb21wcmVzc29ycyIsInJlYWQ6cHJvamVjdHMiLCJ3cml0ZTpwcm9qZWN0cyIsInJlYWQ6bWVhc3VyZW1lbnRzIiwid3JpdGU6bWVhc3VyZW1lbnRzIiwicmVhZDptZXNzYWdlcyJdfQ.CEpDtim5lhY09q3LZ20xgg4W6u4ZibWObdLhWCHc_RPTFOoByit2d4n1K1XK4gVLnJtGooCzskJEIL9y-HSYSOnrSGb3-aPU3R79-g3WwQd_GVlBkvWwp9BpsmSXeWM6JZOidlBhYmKk7gCrnRWshECNxSD7mafaBTGVjtbP3U9KqG33oTORTx9TOGIgsKNmpWtYRISvJmKDN3U0a1CuP0drNhFzC7O0hVnBoFM_aZGflbcnXWZiwkNIjeplDt-UaEJCKz2qZaWC_Zy7spsr_WnkjjIn6faDl5N7JznhzVyvMcfXLCMabDpttWmsyKuW9PkciX6YNcYlse3-7jzGVw";
        }

        private void AddAuthorizationHeader()
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _token);
        }

        [Fact]
        public async Task GetCompressors_ReturnsSuccessStatusCode()
        {
            // Arrange
            AddAuthorizationHeader();

            // Act
            var response = await _client.GetAsync("/api/Compressors");

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task GetCompressor_ReturnsCompressor()
        {
            // Arrange
            AddAuthorizationHeader();
            var compressorId = Guid.NewGuid();
            var compressor = new Compressor
            {
                CompressorId = compressorId,
                Model = "Model1",
                Capacity = 10,
                ProjectId = Guid.NewGuid()
            };
            await _client.PostAsJsonAsync("/api/Compressors", compressor);

            // Act
            var response = await _client.GetAsync($"/api/Compressors/{compressorId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var returnedCompressor = await response.Content.ReadFromJsonAsync<Compressor>();
            Assert.NotNull(returnedCompressor);
            Assert.Equal(compressorId, returnedCompressor.CompressorId);
        }

        [Fact]
        public async Task CreateCompressor_ReturnsCreatedCompressor()
        {
            // Arrange
            AddAuthorizationHeader();
            var compressor = new Compressor
            {
                CompressorId = Guid.NewGuid(),
                Model = "Model1",
                Capacity = 10,
                ProjectId = Guid.NewGuid()
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/Compressors", compressor);

            // Assert
            response.EnsureSuccessStatusCode();
            var createdCompressor = await response.Content.ReadFromJsonAsync<Compressor>();
            Assert.NotNull(createdCompressor);
            Assert.Equal(compressor.CompressorId, createdCompressor.CompressorId);
        }

        [Fact]
        public async Task UpdateCompressor_ReturnsNoContent()
        {
            // Arrange
            AddAuthorizationHeader();
            var compressorId = Guid.NewGuid();
            var compressor = new Compressor
            {
                CompressorId = compressorId,
                Model = "Model1",
                Capacity = 10,
                ProjectId = Guid.NewGuid()
            };
            await _client.PostAsJsonAsync("/api/Compressors", compressor);
            compressor.Model = "UpdatedModel";

            // Act
            var response = await _client.PutAsJsonAsync($"/api/Compressors/{compressorId}", compressor);

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task DeleteCompressor_ReturnsNoContent()
        {
            // Arrange
            AddAuthorizationHeader();
            var compressorId = Guid.NewGuid();
            var compressor = new Compressor
            {
                CompressorId = compressorId,
                Model = "Model1",
                Capacity = 10,
                ProjectId = Guid.NewGuid()
            };
            await _client.PostAsJsonAsync("/api/Compressors", compressor);

            // Act
            var response = await _client.DeleteAsync($"/api/Compressors/{compressorId}");

            // Assert
            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task GetMeasurementsDataByCompressorId_ReturnsMeasurements()
        {
            // Arrange
            AddAuthorizationHeader();
            var compressorId = Guid.NewGuid();
            var compressor = new Compressor
            {
                CompressorId = compressorId,
                Model = "Model1",
                Capacity = 10,
                ProjectId = Guid.NewGuid()
            };
            await _client.PostAsJsonAsync("/api/Compressors", compressor);

            var measurementData = new MeasurementData
            {
                MeasurementDataId = Guid.NewGuid(),
                CompressorId = compressorId,
                DataJson = "",
                Timestamp = DateTime.UtcNow
            };
            await _client.PostAsJsonAsync("/api/MeasurementsData", measurementData);

            // Act
            var response = await _client.GetAsync($"/api/Compressors/{compressorId}/MeasurementsData");

            // Assert
            response.EnsureSuccessStatusCode();
            var measurements = await response.Content.ReadFromJsonAsync<IEnumerable<MeasurementData>>();
            Assert.NotNull(measurements);
            Assert.NotEmpty(measurements);
        }
    }
}
