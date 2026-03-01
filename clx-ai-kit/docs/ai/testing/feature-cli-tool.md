---
phase: testing
title: "CLI Tool (@anhvt2280/aidk) — Testing Strategy"
description: Testing approach and test cases for the AI DevKit CLI tool
feature: cli-tool
created: 2026-02-23
---

# Testing Strategy: CLI Tool (@anhvt2280/aidk)

**Related docs**: [Requirements](../requirements/feature-cli-tool.md) | [Design](../design/feature-cli-tool.md) | [Planning](../planning/feature-cli-tool.md) | [Implementation](../implementation/feature-cli-tool.md)

## Test Coverage Goals

| Test level | Scope | Coverage target |
|-----------|-------|----------------|
| Unit | Utility functions (config, fs, registry) | 100% of new code |
| Integration | Command handlers (init, add, remove, list, update) | All happy paths + key error paths |
| End-to-end | Full CLI invocation via `npx`/`node dist/index.js` | Key user stories from requirements |

## Test Conventions (Vitest)

### Structure: AAA Pattern

```typescript
test('returns empty array when no skills are installed', () => {
  // Arrange
  const config = createEmptyConfig();

  // Act
  const result = getInstalledSkills(config);

  // Assert
  expect(result).toEqual([]);
});
```

### Naming

Use descriptive names: `copies skill to .cursor/skills/ when cursor is configured`, not `test add skill`.

### Test Isolation

Each integration test operates in a temporary directory (`fs.mkdtempSync`) to avoid polluting the real filesystem. Cleanup runs in `afterEach`.

## Unit Tests

### Config Manager (`src/utils/config.ts`)

| Test case | Scenario | Expected result | Priority | Status |
|-----------|----------|----------------|----------|--------|
| reads valid config | Happy path: `.ai-devkit.json` exists with valid JSON | Parsed config object | P0 | [ ] |
| returns null for missing config | `.ai-devkit.json` does not exist | null (not an error) | P0 | [ ] |
| throws for invalid JSON | `.ai-devkit.json` has malformed content | Descriptive error | P0 | [ ] |
| writes config with formatting | Config object written | Valid JSON with 2-space indent | P0 | [ ] |
| preserves unknown fields | Config has extra fields not in schema | Fields preserved on write | P1 | [ ] |

### File System Utils (`src/utils/fs.ts`)

| Test case | Scenario | Expected result | Priority | Status |
|-----------|----------|----------------|----------|--------|
| copies file to new directory | Target dir does not exist | Creates dir and copies file | P0 | [ ] |
| copies directory recursively | Skill directory with nested files | All files copied | P0 | [ ] |
| removes file | File exists | File deleted | P0 | [ ] |
| removes directory recursively | Skill directory | Directory and contents deleted | P0 | [ ] |
| handles missing source gracefully | Source file does not exist | Descriptive error | P0 | [ ] |
| detects file content changes | Compare two file versions | Returns true if different | P0 | [ ] |

### Component Registry (`src/registry/index.ts`)

| Test case | Scenario | Expected result | Priority | Status |
|-----------|----------|----------------|----------|--------|
| lists all skills | Registry loaded | Returns all 15 skill entries | P0 | [ ] |
| lists all commands | Registry loaded | Returns all 13 command entries | P0 | [ ] |
| lists all rules | Registry loaded | Returns all 3 rule entries | P0 | [ ] |
| lists all phases | Registry loaded | Returns all 7 phase entries | P0 | [ ] |
| finds component by name | Valid name | Returns component meta | P0 | [ ] |
| returns null for unknown component | Invalid name | null | P0 | [ ] |

## Integration Tests

### `aidk init` Command

| Scenario | Setup | Expected behavior | Status |
|----------|-------|-------------------|--------|
| Scaffolds for Cursor only | Empty temp dir, mock prompts: cursor only | `.cursor/` created, no `.agent/`, `docs/ai/` created, `.ai-devkit.json` written | [ ] |
| Scaffolds for Antigravity only | Empty temp dir, mock prompts: antigravity only | `.agent/` created, no `.cursor/`, rules are `.md` not `.mdc` | [ ] |
| Scaffolds for both IDEs | Empty temp dir, mock prompts: both | `.cursor/` and `.agent/` both created with correct formats | [ ] |
| Scaffolds selected phases only | Mock prompts: only requirements + design | Only those 2 phase dirs in `docs/ai/` | [ ] |
| Scaffolds selected skills only | Mock prompts: select 3 specific skills | Only those 3 skills in IDE dirs | [ ] |
| Warns on existing project | Temp dir with existing `.ai-devkit.json` | Warning prompt shown | [ ] |

### `aidk add` Command

| Scenario | Setup | Expected behavior | Status |
|----------|-------|-------------------|--------|
| Adds skill to Cursor project | Config with `environments: ["cursor"]` | Skill dir copied to `.cursor/skills/` | [ ] |
| Adds skill to both IDEs | Config with both environments | Skill in `.cursor/skills/` and `.agent/skills/` | [ ] |
| Adds command (Cursor + Antigravity) | Config with both environments | `.cursor/commands/{name}.md` and `.agent/workflows/{name}.md` | [ ] |
| Adds rule with format conversion | Config with both environments | `.cursor/rules/{name}.mdc` and `.agent/rules/{name}.md` | [ ] |
| Rejects unknown component | Invalid component name | Error message with available names | [ ] |
| Warns on already-installed | Component already in config | Warning, no duplicate files | [ ] |
| Fails without init | No `.ai-devkit.json` | Error suggesting `aidk init` | [ ] |

### `aidk remove` Command

| Scenario | Setup | Expected behavior | Status |
|----------|-------|-------------------|--------|
| Removes installed skill | Skill exists in config and filesystem | Files deleted, config updated | [ ] |
| Removes from both IDEs | Both environments configured | Files removed from both dirs | [ ] |
| Warns on not-installed component | Component not in config | Warning message, no error | [ ] |

### `aidk list` Command

| Scenario | Setup | Expected behavior | Status |
|----------|-------|-------------------|--------|
| Lists all components | Config with some installed | Shows available with installed markers | [ ] |
| Lists filtered by type | `aidk list skills` | Only skills shown | [ ] |
| Lists with nothing installed | Empty config | All components shown as not installed | [ ] |

### `aidk update` Command

| Scenario | Setup | Expected behavior | Status |
|----------|-------|-------------------|--------|
| Detects modified files | Template differs from installed | Shows list of changes, prompts for confirmation | [ ] |
| Applies all updates on confirm | User selects "Yes, update all" | All files updated, config version bumped | [ ] |
| Applies selective updates | User selects specific files | Only selected files updated | [ ] |
| Skips on cancel | User selects "Cancel" | No files changed | [ ] |
| Reports no changes | All files match templates | "Already up to date" message | [ ] |

## Test Data

- **Temp directories**: Each integration test creates a fresh `os.tmpdir()` subdirectory
- **Mock prompts**: Override `@clack/prompts` via dependency injection or module mocking
- **Fixture configs**: Predefined `.ai-devkit.json` objects for various states (empty, partial, full)
- **No PII or secrets** in test data

## Test Reporting & Coverage

```bash
# Run all tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- tests/commands/init.test.ts
```

| Module | Target coverage |
|--------|----------------|
| `src/utils/` | 100% |
| `src/registry/` | 100% |
| `src/commands/` | 90%+ (prompt mocking may leave some branches) |
| `src/scaffolders/` | 95%+ |

## Manual Testing

- [ ] Run `npx @anhvt2280/aidk init` in a fresh directory — verify all prompts and output
- [ ] Run full lifecycle: init → add → list → remove → list → update
- [ ] Test on macOS and Linux
- [ ] Verify published package installs correctly from GitHub Packages
- [ ] Verify interactive prompts render correctly in different terminal emulators

## Security Testing

- [ ] Input validation: invalid command args produce helpful errors (not stack traces)
- [ ] No secrets in test data or fixtures
- [ ] `aidk update` never modifies files without explicit user consent
