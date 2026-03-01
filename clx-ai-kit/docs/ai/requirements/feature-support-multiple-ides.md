---
phase: requirements
title: Requirements - Support Multiple IDEs
description: Requirements and success criteria for allowing aidk to target multiple IDEs simultaneously.
---

# Requirements & Problem Understanding

**Related docs**: [Design](../design/feature-support-multiple-ides.md) | [Planning](../planning/feature-support-multiple-ides.md) | [Implementation](../implementation/feature-support-multiple-ides.md) | [Testing](../testing/feature-support-multiple-ides.md)
**Applicable rules/skills**: `cxl-brainstorming` (steps 1-4)

## Problem Statement
**What problem are we solving?**
Developers may use multiple tools on the same project (e.g., using Cursor most of the time, but bringing in Claude Code or Antigravity for specific tasks). Currently, `aidk` overwrites configurations, effectively forcing users to pick just one IDE format at a time. The problem is allowing multi-IDE scaffolding safely.

## Stakeholders
**Who needs to be involved?**
- CLI tool builders and maintainers
- End users operating Cursor, Claude Code, and Antigravity environments

## Goals & Objectives
**What do we want to achieve?**
- Support scaffolding and updating config across all three environments (`cursor`, `claude-code`, `antigravity`) simultaneously.
- Enhance `aidk init` so `environments` configurations are strictly merged.

## Non-Goals & Scope Boundaries
**What is explicitly out of scope?**
- Removing existing `.ai-devkit.json` values programmatically without user intervention via manual config manipulation.
- Implementing an IDE format beyond the current known formats.
- Complete CI/CD updates for non-CLI tools.

## User Stories & Use Cases
| Priority | User type | Story | Notes |
|----------|-----------|-------|-------|
| P0 | Developer | As a developer currently using `aidk` for Cursor, I want to add `claude-code` via `aidk init` so that my `cursor` config remains unharmed while also building for Claude. | |
| P1 | Developer | As a developer adding an `aidk` skill, I want it to scaffold into both `.cursor/` and `.claude/` if both are configured. | |

## Success Criteria
| Criteria | Target | How to measure |
|----------|--------|----------------|
| Configuration Preservation | Do not overwrite previous environment arrays | Run `init` picking a new IDE and verify old `environments` remains. |

## Non-Functional Requirements
- **Performance**: Similar load times as previous executions of `aidk`.
- **Maintenance**: The deduplication array-union approach keeps maintenance tight without bloating config files. 

## Constraints & Assumptions
- Constraints: Must work entirely through NodeJS CLI standard prompts. 
- Assumptions: When `init` selects new IDEs, it's acceptable to re-run scaffolding for existing tools within the same transaction.

## Dependencies
- Pre-existing scaffolding structure relying on `Environments[]` parameters.

## Questions & Open Items
- None remaining.
