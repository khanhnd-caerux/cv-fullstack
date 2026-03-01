---
phase: implementation
title: Claude Code Environment Support — Implementation
description: Implementation notes and technical details for Claude Code support
---

# Implementation Guide — Claude Code Support

> **Template**: Run `/execute-plan` to work through tasks.

**Related docs**: [Requirements](../requirements/feature-claude-code-support.md) | [Design](../design/feature-claude-code-support.md) | [Planning](../planning/feature-claude-code-support.md) | [Testing](../testing/feature-claude-code-support.md)

## Development Setup

```bash
cd /Users/anhvt/self/ai-dev-kit-gitlab
npm install
npm run build
npm test
```

## Code Structure

```
src/
├── types.ts              # Add 'claude-code' to Environment
├── utils/
│   └── paths.ts          # Add claudeCodeTemplatesDir()
├── scaffolders/
│   ├── index.ts          # Add claude-code routing
│   ├── cursor.ts         # Unchanged
│   ├── antigravity.ts    # Unchanged
│   ├── claude-code.ts    # NEW: Claude Code scaffolder
│   └── shared.ts         # Add CLAUDE.md scaffolding
├── registry/
│   └── index.ts          # Environment-aware scanning
├── commands/
│   ├── init.ts           # Add Claude Code to IDE selection
│   └── update.ts         # Support claude-code target paths
templates/
├── cursor/               # Unchanged
├── claude-code/           # NEW: Claude Code templates
│   ├── skills/           # 16 skills
│   ├── commands/         # 15 commands
│   └── rules/            # 3 rules
└── shared/
    ├── AGENTS.md          # Updated: mention Claude Code
    └── CLAUDE.md          # NEW: Claude Code project memory
```

## Implementation Notes

| Feature / Area | Approach | Why this way | Caveats |
|---------------|----------|-------------|---------|
| Scaffolder module | Mirror `antigravity.ts` pattern | Proven pattern, minimal risk | None |
| Directory mapping | `skill` → `.claude/skills`, `command` → `.claude/commands`, `rule` → `.claude/rules` | Matches Claude Code conventions | Different from cursor (`.cursor/commands`) and antigravity (`.agent/workflows`) |
| Template format | Skills: same SKILL.md; Commands: add `name:` to frontmatter; Rules: `.md` not `.mdc` | Claude Code has different frontmatter requirements | Must keep in sync with cursor templates |
| CLAUDE.md | Generated via shared scaffolder | Consistent with AGENTS.md pattern | Only generated when `claude-code` is selected |
| Registry | Scan `templates/claude-code/` in addition to `templates/cursor/` | Environment-aware resolution | Deduplication needed in `aidk list` |

### Key Differences: Claude Code vs Cursor Templates

**Skills:**
- Same `SKILL.md` file format
- Path references changed: `.cursor/skills/` → `.claude/skills/`, `.cursor/rules/` → `.claude/rules/`

**Commands:**
- Cursor uses `description:` frontmatter only
- Claude Code uses `name:` + `description:` frontmatter
- Path references updated

**Rules:**
- Cursor uses `.mdc` extension with `alwaysApply: true` frontmatter
- Claude Code uses `.md` extension, no `alwaysApply` (all rules auto-loaded)
- Path references changed: `.cursor/rules/` → `.claude/rules/`, `.cursor/skills/` → `.claude/skills/`
