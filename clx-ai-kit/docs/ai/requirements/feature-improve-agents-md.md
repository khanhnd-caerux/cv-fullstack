---
phase: requirements
title: Requirements & Problem Understanding
description: Improve the AGENTS.md template to be lean, focused, and aligned with Cursor conventions
---

# Requirements: Improve AGENTS.md Template

**Related docs**: [Design](../design/feature-improve-agents-md.md) | [Planning](../planning/feature-improve-agents-md.md)

## Problem Statement

The current `templates/shared/AGENTS.md` has several issues:
- **Bloated with duplicated content**: 40% of the file is a command list that goes stale when workflows change
- **Missing critical instructions**: No mention of rules, brainstorming mandate, or the rules-first process
- **Generic guidance**: "Write clear, self-documenting code" wastes context window — AI already knows this
- **Doesn't leverage AI self-discovery**: Lists everything inline instead of pointing to directories

The file is a Cursor `AGENTS.md` convention file — it should be a lean pointer to sources of truth, not a comprehensive reference.

## Stakeholders

- AI agents (Cursor Agent) — primary consumer
- AIDK users — projects that run `aidk init` receive this file

## Goals & Objectives

- **Primary**: Reduce AGENTS.md to ~35-50 lines of lean, focused instructions
- **Primary**: Point to directories (`docs/ai/`, `.cursor/rules/`, `.cursor/skills/`) instead of duplicating content
- **Primary**: Include the mandatory brainstorming process instruction
- **Secondary**: Remove content that AI agents already know (generic coding advice)

## Non-Goals & Scope Boundaries

- Not listing individual workflow commands
- Not including coding style guidelines (belongs in rules)
- Not using nested AGENTS.md pattern
- Not creating subdirectory-specific AGENTS.md files

## User Stories & Use Cases

| Priority | User type | Story |
|----------|-----------|-------|
| P0 | AI agent | As an AI agent, I need to know this project uses ai-devkit phase-based workflow so I can check docs before implementing |
| P0 | AI agent | As an AI agent, I need to know where rules and skills are so I can read them before starting work |
| P0 | AI agent | As an AI agent, I need to know brainstorming is mandatory before creative work |
| P1 | AI agent | As an AI agent, I need to know the 7 documentation phases so I can navigate `docs/ai/` effectively |

## Success Criteria

| Criteria | Target | How to measure |
|----------|--------|----------------|
| File length | < 50 lines of content | Line count |
| No duplicated command lists | 0 commands listed | Manual review |
| Points to directories | All context via directory pointers | Manual review |
| Brainstorming mandate present | Explicitly stated | Manual review |

## Constraints & Assumptions

- Must work with Cursor's AGENTS.md convention (project root, markdown format)
- AI agents can list directories and read files to discover workflows/skills
- Rules in `.cursor/rules/` are auto-loaded by Cursor
- The template is copied to `{project}/AGENTS.md` during `aidk init`
