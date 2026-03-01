---
phase: requirements
title: "CLI Tool (@caeruxlab/aidk)"
description: A private CLI tool distributed via GitLab Package Registry to scaffold AI DevKit structures into projects
feature: cli-tool
created: 2026-02-23
---

# Requirements: CLI Tool (@caeruxlab/aidk)

**Related docs**: [Design](../design/feature-cli-tool.md) | [Planning](../planning/feature-cli-tool.md) | [Implementation](../implementation/feature-cli-tool.md) | [Testing](../testing/feature-cli-tool.md)

## Problem Statement

**What problem are we solving?**

- Setting up AI-assisted development structures (rules, skills, commands/workflows, doc templates) in projects is currently a manual copy-paste process
- There is no standardized way to initialize, add, remove, or update these components across projects
- Two IDE agent systems (Cursor and Antigravity/Google IDE) require parallel directory structures with slightly different formats (`.mdc` vs `.md`, `commands/` vs `workflows/`)
- Keeping structures up-to-date across projects when templates evolve requires manual effort and is error-prone

**Who is affected?** Developers using AI-assisted development with Cursor and/or Antigravity IDEs.

**Cost of not solving:** Manual setup is slow, inconsistent, and creates drift between projects. Updates to templates don't propagate.

## Stakeholders

- **Owner**: @anhvt2280 (sole maintainer)
- **Users**: Developers on personal/team projects using AI DevKit

## Goals & Objectives

**Primary goals (must ship):**

1. `aidk init` -- interactively scaffold a full AI DevKit structure into a project (IDE selection, phase selection, skill selection)
2. `aidk add <type> <name>` -- add individual components (skills, commands, rules, doc phases) to an existing project
3. `aidk remove <type> <name>` -- remove individual components
4. `aidk list [type]` -- show available and installed components
5. `aidk update` -- update scaffolding to latest CLI version with explicit file-by-file confirmation before overwriting

**Secondary goals (valuable but deferrable):**

- Shell auto-completion for commands and component names
- `aidk doctor` -- verify project health (missing files, broken references)

## Non-Goals & Scope Boundaries

- No remote registry or runtime fetching (all templates bundled in npm package)
- No plugin system for third-party skills (not in v1)
- No GUI/web interface
- No support for IDEs beyond Cursor and Antigravity
- No complex templating engine (straight file copy with minimal token replacement)

## User Stories & Use Cases

| Priority | User type | Story | Notes |
|----------|-----------|-------|-------|
| P0 | Developer | As a developer, I want to run `npx @caeruxlab/aidk init` in a new project and interactively choose which IDEs, phases, and skills to scaffold | Full interactive setup |
| P0 | Developer | As a developer, I want to run `aidk add skill cxl-fastapi` to add a single skill to my existing project | Must detect configured IDEs from `.ai-devkit.json` |
| P0 | Developer | As a developer, I want to run `aidk remove skill cxl-ansible` to cleanly remove a component | Deletes files and updates config |
| P0 | Developer | As a developer, I want to run `aidk list skills` to see which skills are available vs installed | Clear visual distinction |
| P0 | Developer | As a developer, I want to run `aidk update` and see exactly which files will change before confirming | Must never overwrite without consent |
| P1 | Developer | As a developer, I want the CLI to handle both Cursor (`.cursor/`) and Antigravity (`.agent/`) with correct file formats | `.mdc` for Cursor rules, `.md` for Antigravity |
| P1 | Developer | As a developer, I want `.ai-devkit.json` to track everything installed so the CLI knows the project state | Source of truth for project config |

**Unhappy paths and edge cases:**

- Running `aidk init` in a project that already has AI DevKit scaffolding (should warn/offer to re-init)
- Running `aidk add` for a component that's already installed (should skip or warn)
- Running `aidk remove` for a component that doesn't exist (should warn gracefully)
- Running `aidk update` when already on latest version (should report no changes)
- Missing `.ai-devkit.json` when running `add`/`remove`/`update` (should prompt to run `init` first)

## Success Criteria

| Criteria | Target | How to measure |
|----------|--------|----------------|
| `aidk init` scaffolds correct structure for selected IDEs | All files created in correct directories with correct formats | Integration test |
| `aidk add` copies templates to all configured IDE directories | Files exist in `.cursor/` and/or `.agent/` as appropriate | Integration test |
| `aidk remove` cleanly deletes files and updates config | No orphaned files, config reflects removal | Integration test |
| `aidk update` never overwrites without confirmation | Interactive prompt shown for every modified file | Manual + integration test |
| `aidk list` accurately shows available vs installed state | Output matches `.ai-devkit.json` and filesystem | Unit test |
| CLI exits with helpful error messages for all edge cases | Non-zero exit code + descriptive message | Unit test |

## Non-Functional Requirements

- **Performance**: CLI commands should complete in < 2 seconds for typical operations (scaffolding ~50 files). Assumption: local filesystem only, no network calls.
- **Scale**: Single-user CLI tool. No concurrency concerns.
- **Security/Privacy**: No sensitive data handled. Package distributed privately via GitLab Package Registry. No telemetry.
- **Reliability/Availability**: N/A (local CLI tool). Must handle filesystem errors gracefully (permissions, disk full, read-only).
- **Maintenance**: Sole maintainer (@anhvt2280). Templates evolve with the project -- adding a new skill/command to `templates/` automatically makes it available in the CLI.

## Constraints & Assumptions

- **Runtime**: Node.js >= 24 (current LTS v24.13.1 "Krypton")
- **Distribution**: GitLab Package Registry (private, scoped `@caeruxlab`)
- **Source**: Lives in the existing `ai-dev-kit` repository (this repo becomes the CLI package)
- **Templates**: Bundled in the npm package (no network dependency at runtime)
- **Assumption**: Users have `npm` or `npx` available
- **Assumption**: `.mdc` and `.md` rule files are content-identical (only extension differs)
- **Assumption**: Antigravity uses `.agent/workflows/` where Cursor uses `.cursor/commands/`

## Dependencies

- Node.js >= 24
- npm registry: GitLab Package Registry configured for `@caeruxlab` scope
- No external API or service dependencies at runtime

## Questions & Open Items

- ~What is the GitHub scope?~ Resolved: `@anhvt2280`
- ~Should `remove` be in v1?~ Resolved: Yes
- ~Should `update` be in v1?~ Resolved: Yes
- ~What Node.js version?~ Resolved: >= 24 (LTS)
- Are there any `.mdc`-specific metadata fields that need stripping when converting to `.md` for Antigravity?
