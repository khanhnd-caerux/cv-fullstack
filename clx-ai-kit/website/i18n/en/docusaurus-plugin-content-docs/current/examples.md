---
id: examples
title: Usage Examples
sidebar_position: 4
description: Real-world examples of how to use AIDK in your projects.
---

# Usage Examples

## Example 1: Initialize a FastAPI + Next.js project

Suppose you have a new full-stack project with FastAPI (backend) and Next.js (frontend).

```bash
# Step 1: Initialize AIDK structure
cd my-fullstack-project
aidk init

# Step 2: Add FastAPI skill
aidk add skill fastapi

# Step 3: Add PostgreSQL patterns skill
aidk add skill postgres-patterns
```

The AI in your IDE will automatically read these skills and apply FastAPI and PostgreSQL best practices when you ask it for help.

## Example 2: Create requirement docs for a new feature

Use the `/new-requirement` workflow to generate complete documentation from requirements to implementation plan:

```
@[/new-requirement] user-authentication
```

The AI will guide you through:
1. Describing the problem to solve
2. Defining users and use cases
3. Setting success criteria
4. Generating complete documentation files under `docs/ai/`

## Example 3: Review code before pushing

```
@[/code-review]
```

The AI will:
- Compare the implementation against design documentation
- Verify coding style against defined rules
- Report issues that need to be addressed

## Example 4: Debug a complex issue

```
@[/debug] API returns 500 when creating a new user
```

The AI will perform structured root-cause analysis before suggesting any code changes.

## Example 5: Execute an implementation plan

After creating planning documentation with `/new-requirement`, start execution:

```
@[/execute-plan] user-authentication
```

The AI reads `docs/ai/planning/feature-user-authentication.md` and executes each task in a controlled, step-by-step manner.
