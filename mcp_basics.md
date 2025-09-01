# Model Context Protocol (MCP) Basics

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). It enables seamless integration between LLM applications and external data sources and tools. MCP can be thought of as a "USB-C port for AI applications" - providing a standardized way to connect AI models to different data sources and tools.

## Core Architecture

MCP follows a client-server architecture:

- **MCP Hosts**: Programs like Claude Desktop, IDEs, or AI tools that want to access data through MCP
- **MCP Clients**: Protocol clients that maintain 1:1 connections with servers
- **MCP Servers**: Lightweight programs that each expose specific capabilities through the standardized Model Context Protocol
- **Local Data Sources**: Computer files, databases, and services that MCP servers can securely access
- **Remote Services**: External systems available over the internet (e.g., through APIs) that MCP servers can connect to

## MCP Server Capabilities

MCP servers can provide three main types of capabilities:

1. **Resources**: File-like data that can be read by clients (like API responses or file contents)
2. **Tools**: Functions that can be called by the LLM (with user approval)
3. **Prompts**: Pre-written templates that help users accomplish specific tasks

## Benefits of MCP

MCP helps build agents and complex workflows on top of LLMs by providing:

- A growing list of pre-built integrations that LLMs can directly plug into
- The flexibility to switch between LLM providers and vendors
- Best practices for securing data within infrastructure

## Development Tools

Several SDKs are available for developing MCP servers:
- Python SDK
- TypeScript SDK
- Java SDK
- Kotlin SDK

## Integration with Claude

MCP servers can be integrated with Claude Desktop and Claude Code. This allows Claude to access external tools and data sources through the standardized protocol.

## Example MCP Server Implementation

A basic MCP server implementation involves:
1. Setting up the environment with the appropriate SDK
2. Defining the server capabilities (resources, tools, prompts)
3. Implementing the execution handlers for each capability
4. Running the server and connecting it to an MCP host

For example, a weather MCP server might expose tools like `get-alerts` and `get-forecast` that Claude could use to provide weather information to users.
