---
layout: post
title: "Beyond Basic HTTP MCP: Production Security Enhancements"
date: 2025-12-05 01:00:00 -0000
categories: [mcp, ai-platforms, architecture]
tags: [http-mcp, tools, retrieval, security, architecture]
author: Rakesh Navale
excerpt: "The Model Context Protocol specification provides HTTP transport basics. This article shows the critical security enhancements needed for production AI knowledge systems: MISE authentication replacing basic OAuth, multi-tenant isolation preventing data leaks, and comprehensive audit logging for compliance."
---

## Beyond Basic HTTP MCP: Production Security Enhancements

---

## What the Default HTTP MCP Doesn't Give You

The [MCP HTTP specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports) defines the wire protocol: JSON-RPC 2.0 over HTTP POST. Follow the spec, and you'll have a working server. But production AI systems accessing corporate knowledge bases need security controls the specification deliberately leaves to implementers.

**What's Missing from Basic HTTP MCP:**

| Security Requirement | Default HTTP MCP | Production Enhancement |
|---------------------|------------------|------------------------|
| **Authentication** | "Use HTTPS" | MISE OAuth 2.1 with Azure AD token validation |
| **Multi-Tenancy** | Not addressed | Tenant extraction from JWT, query-level isolation |
| **Audit Compliance** | Not addressed | User+tool+data access logging, GDPR-ready |
| **Rate Limiting** | Not addressed | Per-user quotas, abuse prevention |
| **Input Validation** | Basic JSON parsing | Parameter sanitization, injection prevention |
| **Error Handling** | Generic JSON-RPC errors | Redacted errors, no internal detail exposure |

The knowledge-mcp server implements these enhancements. This article focuses on the critical additions that make HTTP MCP production-ready.

## Enhancement Architecture Overview

The knowledge-mcp server layers security controls on top of the standard MCP HTTP transport:

```
Standard MCP HTTP (from specification)
   ↓
+ MISE Authentication Layer (Azure AD OAuth 2.1)
   ↓
+ Tenant Isolation Middleware (multi-tenant context)
   ↓
+ Enhanced JSON-RPC Validation (beyond spec requirements)
   ↓
+ Audit Logging Middleware (compliance trail)
   ↓
+ Secure Tool Design (parameter validation + output redaction)
```

Each layer adds specific security value. The following sections detail why each enhancement exists and how it's implemented.

## Enhancement 1: MISE Authentication (Beyond Basic OAuth)

**Problem**: The [MCP specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization) mentions OAuth but doesn't mandate implementation details. Basic JWT validation misses critical enterprise features: conditional access policies, device compliance, automatic token rotation.

**Why MISE**: Microsoft Identity Service Essentials provides 20+ years of security hardening. Instead of 400+ lines of custom OAuth code, this single configuration delivers production-grade authentication:

```csharp
// Standard MCP HTTP setup (from specification)
builder.Services
   .AddMcpServer()
   .WithHttpTransport();

// ENHANCEMENT: Add MISE authentication
builder.Services
   .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
   .AddMicrosoftIdentityWebApi(configuration.GetSection("AzureAd"));

builder.Services.AddAuthorization(options =>
{
   options.AddPolicy("RequireKnowledgeScope", policy =>
   {
       policy.RequireAuthenticatedUser();
       policy.RequireClaim("scp", "knowledge_read");
   });
});
```

**Security Value Delivered:**
* ✅ JWT signature validation (prevents token tampering)
* ✅ Automatic token expiration enforcement (15-minute windows)
* ✅ Conditional access integration (MFA, device compliance, IP restrictions)
* ✅ Scope-based authorization (prevents privilege escalation)
* ✅ Multi-tenant tenant ID validation (prevents cross-tenant access)

**Reference**: [MCP Authorization Specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)

## Enhancement 2: Multi-Tenant Isolation (Preventing Data Leaks)

**Problem**: Default HTTP MCP has no tenant concept. Without tenant isolation, AI assistant queries from Organization A could theoretically access Organization B's data if both use the same server.

**Critical Pattern**: Extract tenant ID from validated JWT claims (never trust client-provided tenant IDs), inject into request context, enforce at database query level.

```csharp
public class TenantResolverMiddleware
{
   public async Task InvokeAsync(HttpContext context)
   {
       // SECURITY: Extract tenant from JWT (already validated by MISE)
       var tenantId = context.User.FindFirst("tid")?.Value;
       
       if (string.IsNullOrEmpty(tenantId))
       {
           context.Response.StatusCode = 401;
           return;
       }
       
       // SECURITY: Validate tenant is active (prevents suspended tenant access)
       var tenant = await tenantService.GetTenantAsync(tenantId);
       if (tenant == null || !tenant.IsActive)
       {
           context.Response.StatusCode = 403;
           return;
       }
       
       // CRITICAL: Inject tenant context (all downstream queries inherit)
       context.Items["TenantId"] = tenantId;
       
       await next(context);
   }
}
```

**Enforcement at Query Level:**

```csharp
// MCP tool implementation
public async Task<object> SearchKnowledgeAsync(string query)
{
   // Tenant context automatically available (never parameter-based)
   var tenantId = httpContext.Items["TenantId"] as string;
   
   // ALL queries must include tenant filter
   var results = await searchService.SearchAsync(
       query, 
       tenantId,  // Enforces row-level security
       maxResults: 10
   );
   
   return results;
}
```

**Security Value:**
* ✅ Cross-tenant query injection prevented (tenant from validated JWT, not request)
* ✅ Cache isolation (keys prefixed with tenant ID)
* ✅ Log segregation (every audit entry tagged with tenant)
* ✅ Suspended tenant access blocked (active status check)

## Enhancement 3: Enhanced JSON-RPC Validation (Attack Prevention)

**Problem**: MCP specifies JSON-RPC 2.0 format but doesn't mandate security validation. Malicious payloads can attempt injection attacks, method enumeration, or DoS amplification.

**Critical Addition**: Request buffering for security validation.

```csharp
public async Task InvokeAsync(HttpContext context)
{
   if (context.Request.Path.StartsWithSegments("/mcp"))
   {
       // CRITICAL: Enable buffering (allows multiple reads)
       context.Request.EnableBuffering();
       
       // Validate before processing
       var validationResult = await ValidateJsonRpcAsync(context);
       
       if (!validationResult.IsValid)
       {
           // SECURITY: Return generic error (no internal details)
           context.Response.StatusCode = 400;
           await context.Response.WriteAsync(validationResult.Error);
           return;
       }
       
       // CRITICAL: Reset stream position for MCP handler
       context.Request.Body.Position = 0;
   }
   
   await next(context);
}
```

**Why This Matters**: Without `EnableBuffering()`, reading the body consumes the stream. The validation middleware reads it, then the MCP handler gets an empty body. This pattern allows security validation while preserving the request for actual processing.

**Validation Checks Added:**
* ✅ Payload size limits (1MB max, prevents memory exhaustion)
* ✅ Batch request limits (max 10, prevents amplification attacks)
* ✅ Method allowlist (only registered tools, prevents enumeration)
* ✅ Parameter type validation (prevents type confusion attacks)

**Reference**: [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

## Enhancement 4: Comprehensive Audit Logging (Compliance Ready)

**Problem**: MCP specification requires logging to STDERR but doesn't define what to log. Compliance (SOC 2, GDPR, ISO 27001) demands user-level audit trails.

**Critical Pattern**: Log user identity, not just "AI assistant accessed data."

```csharp
public class AuditLoggingMiddleware
{
   public async Task InvokeAsync(HttpContext context)
   {
       var startTime = DateTime.UtcNow;
       
       // COMPLIANCE: Extract user identity from validated JWT
       var userId = context.User.FindFirst("oid")?.Value;
       var userEmail = context.User.FindFirst("upn")?.Value;
       var tenantId = context.Items["TenantId"] as string;
       
       try
       {
           await next(context);
           
           // AUDIT TRAIL: Log successful access
           logger.LogInformation(
               "MCP Access | User: {Email} | Tenant: {TenantId} | " +
               "Path: {Path} | Status: {Status} | Duration: {Duration}ms",
               userEmail, tenantId, context.Request.Path,
               context.Response.StatusCode,
               (DateTime.UtcNow - startTime).TotalMilliseconds
           );
       }
       catch (Exception ex)
       {
           // SECURITY MONITORING: Log failures for anomaly detection
           logger.LogError(ex,
               "MCP Access Failed | User: {Email} | Tenant: {TenantId}",
               userEmail, tenantId
           );
           throw;
       }
   }
}
```

**Structured JSON Output (STDERR per MCP spec):**

```json
{
 "timestamp": "2026-02-04T15:30:00Z",
 "level": "Information",
 "message": "MCP Tool Invoked",
 "userId": "uuid",
 "userEmail": "alice@example.com",
 "tenantId": "tenant-uuid",
 "toolName": "search_knowledge",
 "query": "customer data retention policy",
 "resultCount": 5,
 "duration": 234
}
```

**Compliance Value:**
* ✅ SOC 2 Evidence: User-level access trails for auditors
* ✅ GDPR Requests: "Show all data accessed by user X"
* ✅ Incident Response: Timeline reconstruction during security events
* ✅ Anomaly Detection: Query for excessive access patterns

## Enhancement 5: Secure Tool Design (Input Validation + Output Redaction)

**Problem**: MCP tools using `[McpServerTool]` attributes automatically expose methods to AI assistants. Without security controls, tools become attack vectors for injection, data exfiltration, or privilege escalation.

**Critical Patterns**:

1. **Parameter Validation**: Never trust AI-generated parameters
2. **Tenant Context Injection**: Never accept tenant ID as parameter (prevents spoofing)
3. **Output Redaction**: Strip sensitive fields before returning results
4. **Generic Error Messages**: Never expose internal exceptions to AI assistants

```csharp
[McpServerToolType]
public class SearchKnowledgeTool(
   IKnowledgeSearch knowledgeSearch,
   IHttpContextAccessor httpContextAccessor)
{
   [McpServerTool(Idempotent = true, ReadOnly = true)]
   [DisplayName("search_knowledge")]
   public async Task<object> SearchAsync(
       [Description("Search query (max 500 characters)")] string query,
       [Description("Max results (1-20)")] int maxResults = 5)
   {
       // SECURITY: Validate parameters (prevents injection)
       if (string.IsNullOrWhiteSpace(query) || query.Length > 500)
           return new { success = false, error = "Invalid query" };
       
       if (maxResults < 1 || maxResults > 20)
           return new { success = false, error = "Invalid range" };
       
       // SECURITY: Tenant from context (never from parameters)
       var tenantId = httpContextAccessor.HttpContext
           .Items["TenantId"] as string;
       
       try
       {
           var results = await knowledgeSearch.SearchAsync(
               query, tenantId, maxResults
           );
           
           // SECURITY: Redact sensitive fields
           var sanitized = results.Select(r => new
           {
               Title = r.Title,
               Summary = r.Summary,
               Url = r.Url
               // OMIT: InternalId, AuthorEmail, SystemPaths
           });
           
           return new { success = true, results = sanitized };
       }
       catch (Exception ex)
       {
           // SECURITY: Log full exception, return generic error
           logger.LogError(ex, "Search failed for user {User}",
               httpContextAccessor.HttpContext.User.Identity?.Name);
           
           return new { 
               success = false, 
               error = "Search failed"  // Generic message only
           };
       }
   }
}
```

**Security Value:**
* ✅ SQL injection prevented (query length limits, type validation)
* ✅ Tenant spoofing prevented (context-based, not parameter-based)
* ✅ Data exfiltration reduced (sensitive fields never returned)
* ✅ Error detail leakage prevented (generic messages to AI)

**Reference**: [MCP Tools Specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/tools)

## Azure Container Apps Deployment

The complete deployment follows standard .NET container patterns. Key enhancements for MCP servers:

**1. Dynamic URL Resolution**: Azure Container Apps generate environment-specific URLs. OAuth redirect URIs break with hardcoded localhost values. Production pattern:

```csharp
// Check environment-provided URL first (Azure Container Apps set this)
var containerAppUrl = Environment.GetEnvironmentVariable("CONTAINER_APP_URL");
if (!string.IsNullOrEmpty(containerAppUrl))
   return containerAppUrl;

// Fallback for local development
return environment.IsDevelopment() ? "http://localhost:8080" : throw new InvalidOperationException();
```

**2. Forwarded Headers Configuration**: Container Apps sit behind Azure ingress. Preserve client IP for audit logs and rate limiting:

```csharp
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
   options.ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                             ForwardedHeaders.XForwardedProto |
                             ForwardedHeaders.XForwardedHost;
   options.KnownNetworks.Clear();  // Trust Azure ingress
   options.KnownProxies.Clear();
});
```

**3. Health Checks for Container Orchestration**:

Container Apps require separate liveness (restart unhealthy containers) and readiness (prevent traffic to warming containers) probes:

```csharp
app.MapHealthChecks("/health/live");   // Basic process health
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
   Predicate = check => check.Tags.Contains("ready")  // Dependency health
});
```

**Deployment Reference**: [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)

## Production Patterns Summary

**What We Added Beyond Basic HTTP MCP:**

| Enhancement | Security Value | Compliance Impact |
|-------------|----------------|-------------------|
| MISE Authentication | 20+ years OAuth hardening vs custom code | SOC 2 Type II ready |
| Multi-Tenant Isolation | Prevents cross-tenant data access | GDPR tenant segregation |
| Enhanced JSON-RPC Validation | Blocks injection/enumeration attacks | Defense-in-depth requirement |
| Comprehensive Audit Logging | User-level access trail | SOC 2, ISO 27001, GDPR audits |
| Secure Tool Design | Prevents parameter injection, data exfiltration | Least privilege enforcement |

**When These Enhancements Matter:**

* **Enterprise AI knowledge systems** serving corporate data
* **Multi-tenant SaaS** with shared infrastructure
* **Compliance-regulated environments** (healthcare, finance, government)
* **Zero-trust architectures** requiring per-request validation

**When Basic HTTP MCP Suffices:**

* **Personal knowledge bases** for local use
* **Single-tenant deployments** with no shared infrastructure
* **Non-sensitive data** without compliance requirements
* **Prototype/POC environments** before production hardening

## Implementation Priorities

If building incrementally, implement in this order for maximum security ROI:

1. **MISE Authentication** (OAuth 2.1, scope validation)
2. **Audit Logging** (user context, tool invocation, data access)
3. **Multi-Tenant Isolation** (if supporting multiple organizations)
4. **Enhanced JSON-RPC Validation** (request buffering, attack prevention)
5. **Secure Tool Design** (parameter validation, output redaction)

Each layer builds on the previous, creating defense-in-depth.

---

## Resources

- **Model Context Protocol specification** – End-to-end protocol model, concepts, and guarantees that underpin both STDIO and HTTP MCP servers. <https://modelcontextprotocol.io/specification>
- **HTTP transport** – Details of the HTTP(S) transport, request/response formats, and how MCP servers should expose endpoints securely. <https://modelcontextprotocol.io/specification/2025-06-18/basic/transports>
- **Authentication & authorization** – Official guidance on bearer tokens, scopes, and authorization flows for protecting MCP tools and resources. <https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization>
- **Tools specification** – How tools are described, invoked, and validated over MCP, including expectations for inputs, outputs, and errors. <https://modelcontextprotocol.io/specification/2025-06-18/basic/tools>
- **Logging & observability** – Recommended logging events, fields, and failure handling for MCP servers, aligned with the patterns in this article. <https://modelcontextprotocol.io/specification/2025-06-18/basic/implementation#logging>

**Related Articles:**
- Securing AI Knowledge Access: HTTP MCP Server Architecture
- Building Enterprise STDIO MCP Servers