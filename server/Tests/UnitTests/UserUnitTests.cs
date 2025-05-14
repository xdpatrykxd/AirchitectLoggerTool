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
    public class UserUnitTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly UserService _userService;

        public UserUnitTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);
            Mock<ILogger<UserService>> loggerMock = new();
            _userService = new UserService(_context, loggerMock.Object);
        }

        private void ClearDatabase()
        {
            _context.Users.RemoveRange(_context.Users);
            _context.SaveChanges();
        }

        [Fact]
        public async Task GetUsersAsync_ReturnsAllUsers()
        {
            // Arrange
            ClearDatabase();
            _context.Users.Add(new User { UserId = Guid.NewGuid(), Auth0Id = "auth0|123", Name = "User 1", GivenName = "Given 1", FamilyName = "Family 1", Nickname = "Nick 1", Email = "user1@example.com", Picture = "http://example.com/pic1.jpg", EmailVerified = true, CreatedAt = DateTime.UtcNow });
            _context.Users.Add(new User { UserId = Guid.NewGuid(), Auth0Id = "auth0|456", Name = "User 2", GivenName = "Given 2", FamilyName = "Family 2", Nickname = "Nick 2", Email = "user2@example.com", Picture = "http://example.com/pic2.jpg", EmailVerified = true, CreatedAt = DateTime.UtcNow });
            await _context.SaveChangesAsync();

            // Act
            var result = await _userService.GetUsersAsync();

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetUserByIdAsync_ReturnsUser()
        {
            // Arrange
            ClearDatabase();
            var userId = Guid.NewGuid();
            _context.Users.Add(new User { UserId = userId, Auth0Id = "auth0|123", Name = "User 1", GivenName = "Given 1", FamilyName = "Family 1", Nickname = "Nick 1", Email = "user1@example.com", Picture = "http://example.com/pic1.jpg", EmailVerified = true, CreatedAt = DateTime.UtcNow });
            await _context.SaveChangesAsync();

            // Act
            var result = await _userService.GetUserAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.UserId);
        }

        [Fact]
        public async Task CreateUserAsync_AddsUser()
        {
            // Arrange
            ClearDatabase();
            var createUserDto = new CreateUserDto
            {
                Auth0Id = "auth0|123",
                Name = "User 1",
                GivenName = "Given 1",
                FamilyName = "Family 1",
                Nickname = "Nick 1",
                Email = "user1@example.com",
                Picture = "http://example.com/pic1.jpg",
                EmailVerified = true
            };

            // Act
            var result = await _userService.CreateUserAsync(createUserDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(createUserDto.Auth0Id, result.Auth0Id);
            Assert.Equal(1, _context.Users.Count());
        }

        [Fact]
        public async Task UpdateUserAsync_UpdatesUser()
        {
            // Arrange
            ClearDatabase();
            var userId = Guid.NewGuid();
            var user = new User { UserId = userId, Auth0Id = "auth0|123", Name = "User 1", GivenName = "Given 1", FamilyName = "Family 1", Nickname = "Nick 1", Email = "user1@example.com", Picture = "http://example.com/pic1.jpg", EmailVerified = true, CreatedAt = DateTime.UtcNow };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var updateUserDto = new UpdateUserDto
            {
                Name = "Updated User",
                GivenName = "Updated Given",
                FamilyName = "Updated Family",
                Nickname = "Updated Nick",
                Picture = "http://example.com/updatedpic.jpg"
            };

            // Act
            var result = await _userService.UpdateUserAsync(userId, updateUserDto);

            // Assert
            Assert.True(result);
            var updatedUser = await _context.Users.FindAsync(userId);
            if (updatedUser != null) Assert.Equal("Updated User", updatedUser.Name);
        }

        [Fact]
        public async Task DeleteUserAsync_DeletesUser()
        {
            // Arrange
            ClearDatabase();
            var userId = Guid.NewGuid();
            var user = new User { UserId = userId, Auth0Id = "auth0|123", Name = "User 1", GivenName = "Given 1", FamilyName = "Family 1", Nickname = "Nick 1", Email = "user1@example.com", Picture = "http://example.com/pic1.jpg", EmailVerified = true, CreatedAt = DateTime.UtcNow };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _userService.DeleteUserAsync(userId);

            // Assert
            Assert.True(result);
            Assert.Null(await _context.Users.FindAsync(userId));
        }

        [Fact]
        public async Task GetUserByIdAsync_ReturnsNullForNonExistentUser()
        {
            // Arrange
            ClearDatabase();
            var nonExistentUserId = Guid.NewGuid();

            // Act
            var result = await _userService.GetUserAsync(nonExistentUserId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateUserAsync_ReturnsFalseForMismatchedIds()
        {
            // Arrange
            ClearDatabase();
            var userId = Guid.NewGuid();
            var user = new User { UserId = userId, Auth0Id = "auth0|123", Name = "User 1", GivenName = "Given 1", FamilyName = "Family 1", Nickname = "Nick 1", Email = "user1@example.com", Picture = "http://example.com/pic1.jpg", EmailVerified = true, CreatedAt = DateTime.UtcNow };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var mismatchedId = Guid.NewGuid();
            var updateUserDto = new UpdateUserDto
            {
                Name = "Updated User",
                GivenName = "Updated Given",
                FamilyName = "Updated Family",
                Nickname = "Updated Nick",
                Picture = "http://example.com/updatedpic.jpg"
            };

            // Act
            var result = await _userService.UpdateUserAsync(mismatchedId, updateUserDto);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task DeleteUserAsync_ReturnsFalseForNonExistentUser()
        {
            // Arrange
            ClearDatabase();
            var nonExistentUserId = Guid.NewGuid();

            // Act
            var result = await _userService.DeleteUserAsync(nonExistentUserId);

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
