---
phase: implementation
title: Implementation Guide - Support Multiple IDEs
description: Technical implementation notes for safely merging multiple IDE environments
---

# Implementation Guide

**Related docs**: [Requirements](../requirements/feature-support-multiple-ides.md) | [Design](../design/feature-support-multiple-ides.md) | [Planning](../planning/feature-support-multiple-ides.md) | [Testing](../testing/feature-support-multiple-ides.md)

## Development Setup
No special setup required beyond the standard CLI tooling setup for `aidk`.

## Code Structure
Changes are localized entirely to `src/commands/init.ts`.

## Implementation Notes

| Feature / Area | Approach | Why this way | Caveats |
|---------------|----------|-------------|---------|
| Prompt Defaults | `p.multiselect({ ... initialValues: existing?.environments })` | Provides a clear indication of current state | It will show existing environments to the user |
| Merging Logic | `const environments = Array.from(new Set([...existing, ...envSelection]))` | Avoids duplicate values and ensures strictly additive behavior | If the user specifically un-checks an existing environment, it will still remain. (Removal was explicitly out of scope for `init`) |

## Integration Points
- Interacts with `@clack/prompts` to gather inputs.
- Modifies `.ai-devkit.json` using config utilities.

## Error Handling
The standard `@clack/prompts` handling via `handleCancel()` is used throughout. No specific errors arise from a simple `Set` union.

## Validation
Validation uses standard array typing mapped to `Environment[]`.
