---
phase: testing
title: Claude Code Environment Support — Testing
description: Testing strategy for Claude Code support feature
---

# Testing Strategy — Claude Code Support

> **Template**: Run `/write-tests` to generate tests.

**Related docs**: [Requirements](../requirements/feature-claude-code-support.md) | [Design](../design/feature-claude-code-support.md) | [Planning](../planning/feature-claude-code-support.md) | [Implementation](../implementation/feature-claude-code-support.md)

## Test Coverage Goals

| Test level | Scope | Coverage target |
|-----------|-------|----------------|
| Unit | `claude-code.ts` scaffolder functions | 100% of new code |
| Integration | `aidk init` with `claude-code` env | Core workflow |
| Regression | Existing cursor/antigravity tests | All pass unchanged |

## Unit Tests

### `src/scaffolders/claude-code.ts`

| Test case | Scenario | Expected result | Priority | Status |
|-----------|----------|----------------|----------|--------|
| Target path for skill | `claudeCodeTargetPath(cwd, 'skill', 'cxl-fastapi')` | `<cwd>/.claude/skills/cxl-fastapi` | P0 | [ ] |
| Target path for command | `claudeCodeTargetPath(cwd, 'command', 'new-requirement')` | `<cwd>/.claude/commands/new-requirement.md` | P0 | [ ] |
| Target path for rule | `claudeCodeTargetPath(cwd, 'rule', '0-force-rule')` | `<cwd>/.claude/rules/0-force-rule.md` | P0 | [ ] |
| Target path for phase | `claudeCodeTargetPath(cwd, 'phase', 'requirements')` | `<cwd>/docs/ai/requirements` | P0 | [ ] |
| Scaffold skill copies directory | Skill directory copied to `.claude/skills/<name>/` | Directory exists with SKILL.md | P0 | [ ] |
| Scaffold command copies file | Command file copied to `.claude/commands/<name>.md` | File exists with correct content | P0 | [ ] |
| Scaffold rule copies file | Rule file copied to `.claude/rules/<name>.md` | File exists with correct content | P0 | [ ] |
| Remove skill removes directory | `removeClaudeCodeComponent` for skill | Directory removed | P1 | [ ] |
| Remove command removes file | `removeClaudeCodeComponent` for command | File removed | P1 | [ ] |

### `src/types.ts`

| Test case | Scenario | Expected result | Priority | Status |
|-----------|----------|----------------|----------|--------|
| ENVIRONMENTS includes claude-code | Check `ENVIRONMENTS` array | Contains `'claude-code'` | P0 | [ ] |

### `src/registry/index.ts`

| Test case | Scenario | Expected result | Priority | Status |
|-----------|----------|----------------|----------|--------|
| Registry loads claude-code skills | `loadRegistry()` scans claude-code templates | Skills from `templates/claude-code/skills/` included | P0 | [ ] |
| Registry loads claude-code commands | `loadRegistry()` scans claude-code templates | Commands from `templates/claude-code/commands/` included | P0 | [ ] |
| Registry loads claude-code rules | `loadRegistry()` scans claude-code templates | Rules from `templates/claude-code/rules/` included | P0 | [ ] |

## Integration Tests

| Scenario | Components involved | Expected behavior | Status |
|----------|-------------------|-------------------|--------|
| Init with claude-code | init → scaffold → claude-code.ts | `.claude/` directories created with all components | [ ] |
| Init with all 3 envs | init → all scaffolders | `.cursor/`, `.agent/`, `.claude/` all created | [ ] |
| Add skill to claude-code | add → scaffold → claude-code.ts | Skill added to `.claude/skills/` | [ ] |
| Update detects claude-code changes | update → detectChanges | Modified claude-code templates flagged | [ ] |

## Regression Tests

| Scenario | Expected behavior | Status |
|----------|-------------------|--------|
| Existing cursor tests | All pass unchanged | [ ] |
| Existing antigravity tests | All pass unchanged | [ ] |
| Config reading/writing | `.ai-devkit.json` backward compatible | [ ] |

## Test Commands

```bash
# Run all tests
npm test

# Run specific test file
npx vitest run tests/scaffolders/claude-code.test.ts

# Run with coverage
npx vitest run --coverage
```
