using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Authorization;
using server.Data;
using server.Services;
using server.Services.Interfaces;

namespace server;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container

        // Add the ApplicationDbContext to the service container with PostgreSQL configuration
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

        // Register the CompressorService
        builder.Services.AddScoped<ICompressorService, CompressorService>();

        // Register the MeasurementDataService
        builder.Services.AddScoped<IMeasurementDataService, MeasurementDataService>();

        // Register the ProjectService
        builder.Services.AddScoped<IProjectService, ProjectService>();

        // Register the UserService
        builder.Services.AddScoped<IUserService, UserService>();

        // Logging configuration
        builder.Logging.ClearProviders();
        builder.Logging.AddConsole();
        builder.Logging.AddDebug();

        // CORS Configuration
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("ComprehensiveCorsPolicy", policy =>
            {
                policy.WithOrigins(
                        "http://localhost:3000",
                        "http://localhost:5173"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        // Authentication Configuration
        var domain = builder.Configuration["Auth0:Domain"];
        var audience = builder.Configuration["Auth0:Audience"];

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = $"https://{domain}/";
                options.Audience = audience;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = $"https://{domain}/",
                    ValidAudience = audience,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(5),
                    NameClaimType = ClaimTypes.NameIdentifier
                };

                // Add token validation events for logging
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        var logger = context.HttpContext
                            .RequestServices
                            .GetRequiredService<ILogger<Program>>();

                        var claims = context.Principal?.Claims;
                        logger.LogInformation("Token validated for user: {User}, Claims: {Claims}",
                            context.Principal?.Identity?.Name, claims);

                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = context =>
                    {
                        var logger = context.HttpContext
                            .RequestServices
                            .GetRequiredService<ILogger<Program>>();

                        logger.LogError("Authentication failed: {Error}",
                            context.Exception.Message);

                        return Task.CompletedTask;
                    }
                };
            });

        // Authorization Policies
        builder.Services.AddAuthorization(options =>
        {
            // Global policies
            options.DefaultPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();

            // Compressors policies
            options.AddPolicy("read:compressors", policy =>
            {
                if (domain != null)
                    policy.Requirements.Add(
                        new HasScopeRequirement("read:compressors", domain)
                    );
            });

            options.AddPolicy("write:compressors", policy =>
            {
                if (domain != null)
                    policy.Requirements.Add(
                        new HasScopeRequirement("write:compressors", domain)
                    );
            });

            // Projects policies
            options.AddPolicy("read:projects", policy =>
            {
                if (domain != null)
                    policy.Requirements.Add(
                        new HasScopeRequirement("read:projects", domain)
                    );
            });

            options.AddPolicy("write:projects", policy =>
            {
                if (domain != null)
                    policy.Requirements.Add(
                        new HasScopeRequirement("write:projects", domain)
                    );
            });

            // Users policies
            options.AddPolicy("read:users", policy =>
            {
                if (domain != null)
                    policy.Requirements.Add(
                        new HasScopeRequirement("read:users", domain)
                    );
            });

            options.AddPolicy("write:users", policy =>
            {
                if (domain != null)
                    policy.Requirements.Add(
                        new HasScopeRequirement("write:users", domain)
                    );
            });

            // Measurements policies
            options.AddPolicy("read:measurements", policy =>
            {
                if (domain != null)
                    policy.Requirements.Add(
                        new HasScopeRequirement("read:measurements", domain)
                    );
            });

            options.AddPolicy("write:measurements", policy =>
            {
                if (domain != null)
                    policy.Requirements.Add(
                        new HasScopeRequirement("write:measurements", domain)
                    );
            });
        });

        // Dependency Injection for Authorization
        builder.Services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();

        // Add API Controllers
        builder.Services.AddControllers();

        // Add API Explorer for Swagger
        builder.Services.AddEndpointsApiExplorer();

        // Add Swagger/OpenAPI support
        builder.Services.AddSwaggerGen(options =>
        {
            // Define the Bearer token authentication for Swagger UI
            options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                Name = "Authorization",
                Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "Enter 'Bearer' followed by a space and your JWT token."
            });

            // Add the security requirement to apply the Bearer token authentication globally
            options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
            {
                {
                    new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                    {
                        Reference = new Microsoft.OpenApi.Models.OpenApiReference
                        {
                            Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    []
                }
            });
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // Use CORS before other middleware
        app.UseCors("ComprehensiveCorsPolicy");

        // Use HTTPS Redirection
        app.UseHttpsRedirection();

        // Authentication & Authorization (order is important)
        app.UseAuthentication();
        app.UseAuthorization();

        // Map Controllers
        app.MapControllers();

        // Log application start
        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Application started at {Time}", DateTime.UtcNow);

        // Run the application
        app.Run();

        // Log application stop
        AppDomain.CurrentDomain.ProcessExit += (_, _) =>
        {
            logger.LogInformation("Application stopped at {Time}", DateTime.UtcNow);
        };
    }
}
