using AutoFixture;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using server.Authorization;
using server.Data;
using server.Models;
using System.Net.Mime;
using System.Text;
using server;

namespace Tests.IntegrationTests.Controllers;

public class CompressorControllerTests
{
    private readonly Fixture _fixture;

    public CompressorControllerTests()
    {
        _fixture = new Fixture();
        // Ignore circular dependencies when attempting to instantiate objects
        _fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    [Fact]
    public async Task AddCompressor_Works()
    {
        // Arrange
        #region re-usable code
        var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder
                    .UseEnvironment("IntegrationTesting")
                    .ConfigureTestServices(services =>
                    {
                        services.AddAuthentication(options =>
                        {
                            options.DefaultScheme = "Test";
                            options.DefaultAuthenticateScheme = "Test";
                            options.DefaultChallengeScheme = "Test";
                        });

                        services.AddSingleton<IPolicyEvaluator, AuthorizationBypasser>();

                        var domain = "TestDomain";
                        services.AddAuthorization(options =>
                        {
                            options.DefaultPolicy = new AuthorizationPolicyBuilder()
                                .RequireAuthenticatedUser()
                                .Build();

                            options.AddPolicy("read:compressors", policy =>
                                policy.Requirements.Add(
                                    new HasScopeRequirement("read:compressors", domain)
                                )
                            );

                            options.AddPolicy("write:compressors", policy =>
                                policy.Requirements.Add(
                                    new HasScopeRequirement("write:compressors", domain)
                                )
                            );

                            options.AddPolicy("read:projects", policy =>
                                policy.Requirements.Add(
                                    new HasScopeRequirement("read:projects", domain)
                                )
                            );

                            options.AddPolicy("write:projects", policy =>
                                policy.Requirements.Add(
                                    new HasScopeRequirement("write:projects", domain)
                                )
                            );

                            options.AddPolicy("read:users", policy =>
                                policy.Requirements.Add(
                                    new HasScopeRequirement("read:users", domain)
                                )
                            );

                            options.AddPolicy("write:users", policy =>
                                policy.Requirements.Add(
                                    new HasScopeRequirement("write:users", domain)
                                )
                            );

                            options.AddPolicy("read:measurements", policy =>
                                policy.Requirements.Add(
                                    new HasScopeRequirement("read:measurements", domain)
                                )
                            );

                            options.AddPolicy("write:measurements", policy =>
                                policy.Requirements.Add(
                                    new HasScopeRequirement("write:measurements", domain)
                                )
                            );

                            options.AddPolicy("admin", policy =>
                                policy.RequireRole("admin")
                            );
                        });

                        services.AddSingleton<IAuthorizationHandler, HasScopeHandlerBypasser>();
                    })
                    .UseDefaultServiceProvider((context, options) =>
                    {
                        options.ValidateOnBuild = true;
                    });
            });

        var context = factory.Services.GetRequiredService<ApplicationDbContext>();
        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();
        #endregion

        var testProject = _fixture.Create<Project>();
        testProject.UserId = Guid.Parse("a718fb63-a4d1-44c1-9740-83ed7fe524ee");
        testProject.User!.Auth0Id = testProject.UserId.ToString();
        await context.Projects.AddAsync(testProject);
        await context.SaveChangesAsync();

        var compressorToAdd = _fixture.Create<Compressor>();
        compressorToAdd.Measurements = new List<MeasurementData>();
        compressorToAdd.ProjectId = testProject.ProjectId;

        var httpBody = JsonConvert.SerializeObject(compressorToAdd);
        using var httpContent = new StringContent(httpBody, Encoding.UTF8, MediaTypeNames.Application.Json);

        using var httpClient = factory.CreateClient();

        // Act
        using var response = await httpClient.PostAsync("api/compressors", httpContent);

        // Assert
        Assert.True(response.IsSuccessStatusCode);

        var dbCompressors = await context.Compressors.ToListAsync();
        var addedCompressor = dbCompressors.FirstOrDefault(x => x.CompressorId.Equals(compressorToAdd.CompressorId));
        Assert.NotNull(addedCompressor);
        Assert.Equal(compressorToAdd.Model, addedCompressor.Model);
    }
}
