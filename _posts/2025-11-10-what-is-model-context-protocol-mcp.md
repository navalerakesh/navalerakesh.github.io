---
layout: post
title: "What Is the Model Context Protocol (MCP)?"
date: 2025-11-10 00:03:00 -0000
categories: [ai-platforms, architecture]
tags: [mcp, tools, retrieval, security, architecture]
author: Rakesh Navale
excerpt: "A crisp introduction to the Model Context Protocol (MCP): what it is, how it works at a high level, and where it fits securely in modern AI architectures across different domains."
---

## The Problem MCP Is Trying to Solve

As soon as you move beyond toy demos, AI assistants need to do two things reliably:

- **Retrieve context** from many systems (code, documents, tickets, incidents, runbooks, knowledge bases), and
- **Call tools** that actually change the world (APIs, workflows, automations).

Most teams discover this the hard way: every assistant ends up with its own ad‑hoc plugin model, its own security story, and its own way of wiring in tools. That creates tight coupling, inconsistent governance, and a lot of duplicated effort.

The **Model Context Protocol (MCP)** is an attempt to standardize this layer. Instead of baking every integration directly into the assistant, you define **MCP servers** that expose resources and tools in a consistent way, and **MCP clients** that let assistants discover and use them.

The official starting point is the MCP site and spec: <https://modelcontextprotocol.io/>.

## Where MCP Came From

MCP was introduced in the mid‑2020s by Anthropic and collaborators as an open protocol for connecting AI assistants to tools and data. Instead of every vendor inventing its own plugin API, the specification defines a vendor‑neutral contract that anyone can implement. The site above publishes the versioned specification and reference implementations, and the ecosystem around it now includes IDE extensions, servers, and language SDKs from multiple communities.

## MCP in One Paragraph

At a high level, MCP is a protocol that lets AI clients (IDEs, chat experiences, custom agent UIs) connect to servers that expose three main concepts:

- **Resources** – read‑only context such as files, documents, search results, or structured records.
- **Tools** – callable operations that the assistant can invoke on behalf of the user, such as creating tickets or running checks.
- **Prompts / templates** – reusable prompt scaffolding the assistant can pull in.

The protocol defines how these are advertised, described, and invoked over a transport, with the goal of making capabilities **discoverable, typed, and secure** rather than arbitrary JSON blobs.

Under the hood, MCP messages follow a simple pattern:

- Requests and responses are structured as JSON‑RPC 2.0 messages.
- Transports such as STDIO or HTTP carry those messages between client and server.
- Schemas describe the shape of tool inputs and outputs, so assistants can reason about parameters and results instead of guessing from free‑form text.

That structure is what lets very different clients and servers interoperate while still keeping the protocol straightforward to implement.

## A Mental Model of MCP Architecture

It’s helpful to picture MCP as three cooperating pieces rather than yet another SDK:

1. **Assistant / Client Experience**  
   The surface the user interacts with – for example, an IDE extension, a browser assistant, or a chat UI. This layer hosts the LLM and is responsible for user interaction and display.

2. **MCP Client**  
   A component that speaks the MCP protocol. It knows how to list available MCP servers, discover the resources and tools they expose, and relay calls and responses between the LLM and those servers.

3. **MCP Servers**  
   Your services that implement the MCP spec. They encapsulate business logic and integrations: querying search indices, calling SaaS APIs, running health checks, or orchestrating workflows.

On a typical request:

1. The user asks a question in the assistant.
2. The LLM decides it needs external data or needs to perform an action.
3. The MCP client chooses the right MCP server and invokes a resource or tool.
4. The MCP server runs your logic (search, API call, workflow) and returns a structured, typed result.
5. The LLM uses that result to build a grounded answer or to plan the next tool call.

The benefit is that once you implement that MCP server, any compatible assistant that understands MCP can reuse it.

```text
User
   ↓
Assistant UI (IDE, chat, portal)
   ↓
MCP Client
   ↓
MCP Servers
   ├── Resource: search_docs, get_pipeline_definition
   └── Tool: create_ticket, run_health_check
   ↓
Backend Systems
   ├── Search index / vector DB
   ├── Ticketing / incident system
   └── Line-of-business APIs
```

## Transports: HTTP vs STDIO

MCP is **transport‑agnostic**; the spec focuses on messages and behaviors. Two transports show up frequently in practice:

- **HTTP‑based servers** – The MCP server exposes HTTP endpoints. This is a natural fit for cloud‑hosted services, shared multi‑tenant back ends, or gateways that sit in front of many systems.
- **STDIO‑based servers** – The MCP server runs as a local process and communicates over standard input/output streams. This is convenient for local CLIs, tools that need filesystem access, or integrations that live next to an IDE.

Choosing between them is mostly about **deployment and trust boundaries**: which parts of your stack run locally, which run in your cloud, and how identities and tokens flow between them.

## Where MCP Fits in a Secure Architecture

MCP does not replace your security model; instead, it gives you a **consistent choke point** where you can enforce it. In a typical enterprise setup, MCP servers are treated as:

- **Gateways** between AI assistants and internal systems.
- Components that perform **authentication and authorization** (for example, Entra ID / OAuth2 / JWT) on every request.
- Places where you implement **policy‑before‑context**: if a user is not entitled to see a document or perform an action, the MCP server blocks it before any data reaches the model.

Practically, this means:

- MCP servers run in your trusted environment (your cloud subscription, on‑prem network, or VPC).
- They receive calls from MCP clients that present tokens or identities on behalf of a user.
- They apply authorization, data‑minimization, and redaction rules.
- They log all accesses and tool calls for audit, debugging, and tuning.

The assistant and LLM then operate on **pre‑filtered, policy‑compliant context** instead of having broad, opaque access to your systems.

## Example Scenarios for Technical Readers

Rather than treat MCP as an abstract idea, it is useful to think through concrete but technology‑agnostic scenarios.

### 1. Software and DevOps

An MCP server exposes resources such as `search_code`, `get_pipeline_definition`, and `list_recent_incidents`, and tools such as `run_health_check` or `trigger_rollout`.

An IDE or chat‑based assistant connects via an MCP client. When a developer asks, “Why did this deployment fail in region X?”, the assistant can:

1. Call `search_incidents` to find relevant past failures.
2. Use `get_pipeline_definition` to inspect the current deployment path.
3. Optionally run a safe, read‑only `run_health_check` tool.

All of that happens behind a single protocol surface rather than bespoke plugins per tool.

### 2. Customer Support and Operations

An MCP server fronts systems like ticketing, knowledge bases, and policy documents. It exposes resources such as `get_policy_doc`, `lookup_case`, and tools like `create_ticket` or `escalate_case`.

A support assistant uses these tools to answer “What is the refund policy for this customer in region Y?” and, if required, open a follow‑up ticket – all while honoring the same role‑based access controls the human agents use.

### 3. Regulated Domains (Healthcare, Finance, Public Sector)

In more regulated settings, MCP servers become even more important. They provide a natural place to:

- Implement domain‑specific redaction and de‑identification.
- Map user identities to entitlements and sensitivity labels.
- Enforce that only curated, approved data sources are used for grounding answers.

The assistant still feels like “ask me anything,” but the set of tools and resources the LLM can actually see is tightly governed.

## Security and Governance Checklist

When you are designing MCP servers for real workloads, a few practical design questions tend to come up over and over:

1. **Identity and Authentication** – How do MCP clients authenticate? Are you using enterprise identity, service principals, or something else? How are tokens issued and refreshed?
2. **Authorization and Policy** – How do you map user or app identities to permissions on tools and resources? Are you using RBAC, ABAC, or a custom model? Where do sensitivity labels fit?
3. **Data Minimization and Redaction** – What is the smallest slice of data you can send to answer a question? Which fields must be redacted or masked before any call leaves the server?
4. **Audit and Observability** – Can you reconstruct, for a given answer, which MCP tools and resources were used, with what parameters, and whether any calls failed?
5. **Evaluation and Safety** – How do you continuously test flows involving MCP tools for leakage, hallucinations, and unexpected side effects?

Thinking about MCP in this structured way helps ensure it becomes a **governed integration layer** rather than just another thin wrapper around APIs.

## Further Reading and Official Resources

If you want to go deeper, a few useful entry points are:

- The MCP site and specification: <https://modelcontextprotocol.io/> – the authoritative description of the protocol, message types, and capabilities.
- Public examples and reference implementations on GitHub (search for “model‑context‑protocol” and “MCP server/client” repositories) to see how others structure servers and clients in practice.
- Broader literature on **tool‑using language models** and **agent architectures**, which provides the conceptual background for why protocols like MCP exist.

The core idea is straightforward but powerful:

> MCP gives you a standardized, secure way to plug your data and tools into AI assistants. Instead of wiring every integration by hand, you design a protocol‑level contract that can be reused, governed, and evolved as your AI surfaces grow.

---