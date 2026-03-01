---
phase: requirements
title: Claude Code Environment Support
description: Add Claude Code as a third environment to AIDK alongside Cursor and Antigravity
---

# Requirements & Problem Understanding — Claude Code Support

> **Prerequisite**: Brainstorming steps 1-4 completed. Understanding Lock confirmed.

**Related docs**: [Design](../design/feature-claude-code-support.md) | [Planning](../planning/feature-claude-code-support.md) | [Implementation](../implementation/feature-claude-code-support.md) | [Testing](../testing/feature-claude-code-support.md)

## Problem Statement

AIDK currently supports two AI coding environments: **Cursor** (`.cursor/`) and **Antigravity** (`.agent/`). Teams using **Claude Code** — Anthropic's CLI-based AI coding assistant — cannot benefit from AIDK's structured skills, commands, rules, and phase documentation scaffolding.

- **Who is affected**: Developers and teams using Claude Code as their primary AI assistant
- **Current workaround**: Manually creating `.claude/skills/`, `.claude/commands/`, and `.claude/rules/` directories and copying content by hand
- **Cost of not solving**: AIDK's value proposition is incomplete — teams using Claude Code are excluded from the structured AI-assisted development workflow

## Stakeholders

- AIDK maintainers (decision makers)
- Claude Code users (primary beneficiaries)

## Goals & Objectives

**Primary goals:**
- Add `claude-code` as a fully supported third environment in the AIDK CLI
- Scaffold skills, commands, and rules into Claude Code's `.claude/` directory structure
- Generate a `CLAUDE.md` project memory file at the project root
- Maintain full backward compatibility with existing `cursor` and `antigravity` environments

**Secondary goals:**
- Update `AGENTS.md` to reference Claude Code directory structure
- Ensure `aidk update` works with Claude Code target paths

## Non-Goals & Scope Boundaries

- **Not** changing how `cursor` or `antigravity` environments work
- **Not** auto-generating `.claude/settings.json` or Claude Code permission configs
- **Not** supporting Claude Code plugins or managed settings
- **Not** implementing Claude Code-specific features like `context: fork`, `agent:`, or `$ARGUMENTS` substitution in existing templates (these can be added later)

## User Stories & Use Cases

| Priority | User type | Story | Notes |
|----------|-----------|-------|-------|
| P0 | Developer | As a Claude Code user, I want to run `aidk init` and select "Claude Code" so that my project gets `.claude/skills/`, `.claude/commands/`, and `.claude/rules/` scaffolded | Core feature |
| P0 | Developer | As a Claude Code user, I want `CLAUDE.md` generated at the project root so Claude Code has project memory | Similar to AGENTS.md |
| P1 | Developer | As a multi-IDE user, I want to select both "Cursor" and "Claude Code" so both `.cursor/` and `.claude/` are scaffolded | Multi-env support |
| P1 | Developer | As a developer, I want `aidk add skill cxl-fastapi` to install into `.claude/skills/` when Claude Code is my environment | Component management |
| P1 | Developer | As a developer, I want `aidk update` to detect and apply template changes for Claude Code components | Update support |
| P2 | Developer | As a developer, I want `aidk list` to show available Claude Code components | Discoverability |

## Success Criteria

| Criteria | Target | How to measure |
|----------|--------|----------------|
| `aidk init` with `claude-code` scaffolds correct directory structure | `.claude/skills/`, `.claude/commands/`, `.claude/rules/` created | Integration test |
| `CLAUDE.md` generated at project root | File exists with correct content | File comparison test |
| All 16 skills scaffolded into `.claude/skills/` | Each skill has `SKILL.md` with proper frontmatter | Directory listing + content check |
| All 15 commands scaffolded into `.claude/commands/` | Each command has `.md` with `name:` + `description:` frontmatter | Content check |
| All 3 rules scaffolded into `.claude/rules/` | Each rule has `.md` format (not `.mdc`) | Extension check |
| Existing cursor/antigravity tests pass unchanged | All prior tests green | CI pipeline |
| `aidk update` detects Claude Code changes | Modified templates flagged | Integration test |
| Backward compatibility | Existing `.ai-devkit.json` configs continue to work | Regression test |

## Non-Functional Requirements

- **Performance**: No meaningful impact — adding a third scaffolder loop is ~O(n) where n is component count (~35)
- **Scale**: N/A (CLI tool, single-user)
- **Security/Privacy**: No sensitive data handled. Templates are plain text
- **Reliability**: CLI should fail gracefully if `.claude/` directory can't be created (permissions)
- **Maintenance**: Template content needs to be kept in sync across 3 environments when underlying skill/command/rule content changes. This is an accepted trade-off for full control per environment.

## Constraints & Assumptions

**Constraints:**
- Must follow existing AIDK architecture patterns (scaffolder per environment)
- TypeScript codebase using `tsup` for bundling, `vitest` for testing
- Templates must be bundled with the npm package

**Assumptions:**
1. `templates/claude-code/` mirrors the same component names as `templates/cursor/`
2. Claude Code skills use the same `SKILL.md` format with YAML frontmatter
3. Claude Code commands use `name:` + `description:` frontmatter (not just `description:`)
4. Claude Code rules use `.md` format (no `.mdc`, no `alwaysApply`)
5. All `.claude/rules/*.md` files are auto-loaded by Claude Code (no opt-in needed)
6. `AGENTS.md` is generated regardless of environment selection

## Dependencies

- None external. All changes are within the AIDK codebase.

## Questions & Open Items

- None remaining — all resolved during brainstorming.
