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

namespace Tests.UnitTests;

    public class ProjectUnitTest : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly ProjectService _projectService;

        public ProjectUnitTest()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);
            Mock<ILogger<ProjectService>> loggerMock = new();
            _projectService = new ProjectService(_context, loggerMock.Object);
        }

        private void ClearDatabase()
        {
            _context.Projects.RemoveRange(_context.Projects);
            _context.SaveChanges();
        }

        [Fact]
        public async Task GetProjectsAsync_ReturnsAllProjects()
        {
            // Arrange
            ClearDatabase();
            _context.Projects.Add(new Project { ProjectId = Guid.NewGuid(), Name = "Project 1" });
            _context.Projects.Add(new Project { ProjectId = Guid.NewGuid(), Name = "Project 2" });
            await _context.SaveChangesAsync();

            // Act
            var result = await _projectService.GetProjectsAsync();

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetProjectByIdAsync_ReturnsProject()
        {
            // Arrange
            ClearDatabase();
            var projectId = Guid.NewGuid();
            _context.Projects.Add(new Project { ProjectId = projectId, Name = "Project 1" });
            await _context.SaveChangesAsync();

            // Act
            var result = await _projectService.GetProjectAsync(projectId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(projectId, result.ProjectId);
        }

        [Fact]
        public async Task CreateProjectAsync_AddsProject()
        {
            // Arrange
            ClearDatabase();
            var createProjectDto = new CreateProjectDto
            {
                Name = "Project 1",
                UserId = Guid.NewGuid()
            };

            // Act
            var result = await _projectService.CreateProjectAsync(createProjectDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(createProjectDto.Name, result.Name);
            Assert.Equal(1, _context.Projects.Count());
        }

        [Fact]
        public async Task UpdateProjectAsync_UpdatesProject()
        {
            // Arrange
            ClearDatabase();
            var projectId = Guid.NewGuid();
            var project = new Project { ProjectId = projectId, Name = "Project 1" };
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            var updateProjectDto = new UpdateProjectDto
            {
                Name = "Updated Project",
                Description = "Updated Description"
            };

            // Act
            var result = await _projectService.UpdateProjectAsync(projectId, updateProjectDto);

            // Assert
            Assert.True(result);
            var updatedProject = await _context.Projects.FindAsync(projectId);
            if (updatedProject != null) Assert.Equal("Updated Project", updatedProject.Name);
        }

        [Fact]
        public async Task DeleteProjectAsync_DeletesProject()
        {
            // Arrange
            ClearDatabase();
            var projectId = Guid.NewGuid();
            var project = new Project { ProjectId = projectId, Name = "Project 1" };
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            // Act
            var result = await _projectService.DeleteProjectAsync(projectId);

            // Assert
            Assert.True(result);
            Assert.Null(await _context.Projects.FindAsync(projectId));
        }

        [Fact]
        public async Task GetProjectByIdAsync_ReturnsNullForNonExistentProject()
        {
            // Arrange
            ClearDatabase();
            var nonExistentProjectId = Guid.NewGuid();

            // Act
            var result = await _projectService.GetProjectAsync(nonExistentProjectId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateProjectAsync_ReturnsFalseForMismatchedIds()
        {
            // Arrange
            ClearDatabase();
            var projectId = Guid.NewGuid();
            var project = new Project { ProjectId = projectId, Name = "Project 1" };
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            var mismatchedId = Guid.NewGuid();
            var updateProjectDto = new UpdateProjectDto
            {
                Name = "Updated Project",
                Description = "Updated Description"
            };

            // Act
            var result = await _projectService.UpdateProjectAsync(mismatchedId, updateProjectDto);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task DeleteProjectAsync_ReturnsFalseForNonExistentProject()
        {
            // Arrange
            ClearDatabase();
            var nonExistentProjectId = Guid.NewGuid();

            // Act
            var result = await _projectService.DeleteProjectAsync(nonExistentProjectId);

            // Assert
            Assert.False(result);
        }

        public void Dispose()
        {
            ClearDatabase();
            _context.Dispose();
        }
    }
