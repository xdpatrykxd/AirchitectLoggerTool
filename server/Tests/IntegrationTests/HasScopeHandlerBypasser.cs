using Microsoft.AspNetCore.Authorization;
using server.Authorization;

namespace Tests.IntegrationTests;

internal class HasScopeHandlerBypasser : AuthorizationHandler<HasScopeRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        HasScopeRequirement requirement)
    {
        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}
