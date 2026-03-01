---
phase: design
title: System Design & Architecture
description: Design for the improved AGENTS.md template
---

# Design: Improve AGENTS.md Template

**Related docs**: [Requirements](../requirements/feature-improve-agents-md.md) | [Planning](../planning/feature-improve-agents-md.md)

## Architecture Overview

The AGENTS.md is a single markdown file template at `templates/shared/AGENTS.md` that gets copied to the project root during `aidk init`. No architectural changes needed — this is a content improvement.

## Design Approach: Minimal Pointer (Approach A)

The file has 5 short sections (~35 lines total), each acting as a pointer to a directory with a one-line explanation:

1. **Project Context** (2-3 lines) — identifies the project as using ai-devkit
2. **Documentation** (~12 lines) — lists 7 phases with directory pointers
3. **Rules & Skills** (~3 lines) — points to `.cursor/rules/` and `.cursor/skills/`
4. **Mandatory Process** (~5 lines) — brainstorming mandate
5. **Development Workflow** (~5 lines) — key behavioral guidelines

## Design Decisions (Decision Log)

| Decision | Chosen approach | Alternatives considered | Trade-offs | Date |
|----------|----------------|----------------------|------------|------|
| Remove command list | Let AI discover from filesystem | Keep full list, keep summary | AI must do lookup, but list can't go stale | 2026-02-24 |
| Point to directories | Directory pointers | Inline all content | Avoids duplication, leverages AI self-discovery | 2026-02-24 |
| Include phase list inline | List 7 phases | Point to `docs/ai/` only | Stable list gives immediate context | 2026-02-24 |
| Keep brainstorming mandate | Prominent instruction | Omit, assume rules handle it | Most critical behavioral instruction | 2026-02-24 |
| Remove generic coding advice | Remove entirely | Keep "write clear code" bullets | AI already knows; wastes context window | 2026-02-24 |
| Target Cursor AGENTS.md convention | Lean markdown | Structured rules format | Simple, widely supported | 2026-02-24 |
