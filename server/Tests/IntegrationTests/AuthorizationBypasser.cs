using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Tests.IntegrationTests
{
    internal class AuthorizationBypasser : IPolicyEvaluator
    {
        public virtual async Task<AuthenticateResult> AuthenticateAsync(AuthorizationPolicy policy, HttpContext context)
        {
            var principal = new ClaimsPrincipal();

            var claimsIdentity = new ClaimsIdentity([], "Test");
            claimsIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, "TestUserId"));
            principal.AddIdentity(claimsIdentity);

            return await Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(principal, new AuthenticationProperties(), "Test")));
        }

        public virtual async Task<PolicyAuthorizationResult> AuthorizeAsync(AuthorizationPolicy policy, AuthenticateResult authenticationResult, HttpContext context, object? resource)
        {
            return await Task.FromResult(PolicyAuthorizationResult.Success());
        }
    }

}
