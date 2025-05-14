using Microsoft.AspNetCore.Authorization;

namespace server.Authorization;

public class HasScopeHandler : AuthorizationHandler<HasScopeRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        HasScopeRequirement requirement)
    {
        if (context.User == null)
        {
            return Task.CompletedTask;
        }

        var scopeClaims = context.User.FindAll(c => c.Type == "scope");

        foreach (var scopeClaim in scopeClaims)
        {
            var scopes = scopeClaim.Value.Split(' ');

            if (scopes.Any(s => s == requirement.Scope))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
        }

        return Task.CompletedTask;
    }
}
