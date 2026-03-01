---
phase: implementation
title: "CLI Tool (@caeruxlab/aidk) — Implementation Guide"
description: Technical implementation details for the AI DevKit CLI tool
feature: cli-tool
created: 2026-02-23
---

# Implementation Guide: CLI Tool (@caeruxlab/aidk)

**Related docs**: [Requirements](../requirements/feature-cli-tool.md) | [Design](../design/feature-cli-tool.md) | [Planning](../planning/feature-cli-tool.md) | [Testing](../testing/feature-cli-tool.md)

## Development Setup

**Prerequisites**: Node.js >= 24, npm

```bash
# Clone and install
git clone https://git.caerux.com/caeruxlab/clx-ai-kit.git
cd clx-ai-kit
npm install

# Build
npm run build

# Link locally for development
npm link

# Run locally
aidk init

# Run tests
npm test
```

### Environment Configuration

No `.env` files required. The CLI is a local tool with no external service dependencies.

## Code Structure

```
ai-dev-kit/
├── src/
│   ├── index.ts                 # Entry: #!/usr/bin/env node, Commander setup
│   ├── commands/
│   │   ├── init.ts              # Full scaffolding with interactive prompts
│   │   ├── add.ts               # Add single component
│   │   ├── remove.ts            # Remove single component
│   │   ├── list.ts              # Show available/installed
│   │   └── update.ts            # Update with diff + confirmation
│   ├── scaffolders/
│   │   ├── cursor.ts            # .cursor/ path mapping + file operations
│   │   ├── antigravity.ts       # .agent/ path mapping + .mdc→.md conversion
│   │   └── shared.ts            # docs/ai/, AGENTS.md, .ai-devkit.json
│   ├── registry/
│   │   └── index.ts             # Component catalog derived from templates/
│   └── utils/
│       ├── config.ts            # .ai-devkit.json read/write
│       ├── fs.ts                # Safe file copy/remove/diff
│       └── prompts.ts           # Reusable @clack/prompts wrappers
├── templates/                   # Bundled as-is in npm package
│   ├── cursor/
│   │   ├── commands/            # 13 command .md files
│   │   ├── rules/               # 3 rule .mdc files
│   │   └── skills/              # 15 skill directories
│   ├── docs/                    # 7 phase README.md templates
│   └── shared/                  # AGENTS.md template
├── tests/
│   ├── commands/                # Command handler tests
│   ├── scaffolders/             # Scaffolder tests
│   ├── registry/                # Registry tests
│   └── utils/                   # Utility tests
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vitest.config.ts
```

### Naming Conventions

- **Files**: kebab-case (`init.ts`, `cursor.ts`, `config.ts`)
- **Functions**: camelCase (`readConfig`, `copyTemplate`, `resolveTemplatePath`)
- **Types/Interfaces**: PascalCase (`ComponentType`, `ComponentMeta`, `DevKitConfig`)
- **Constants**: UPPER_SNAKE_CASE (`SUPPORTED_ENVIRONMENTS`, `COMPONENT_TYPES`)

## Implementation Notes

| Area | Approach | Why | Caveats |
|------|----------|-----|---------|
| Template resolution | `path.resolve(__dirname, '../templates/')` | Templates ship alongside `dist/` | Must adjust for development vs installed paths |
| Rule conversion | Copy file, rename `.mdc` → `.md` | Content is identical | Verify no `.mdc`-specific metadata exists |
| Registry | Static export built from filesystem scan | Zero maintenance | Must rebuild when templates change |
| Config I/O | Read-parse-modify-write pattern | Atomic updates, no partial state | Use `JSON.stringify(config, null, 2)` for readability |
| Update diffing | Compare file content via hash (crypto.createHash) | Fast, reliable change detection | Does not show line-level diffs |

### Patterns & Best Practices

- **Immutable config updates**: never mutate config object; spread and replace
- **Early returns**: validate inputs and bail early with clear error messages
- **Composition over inheritance**: utility functions, not class hierarchies
- **Result types**: functions return `{ success: boolean; message: string }` for testability

## Integration Points

| Integration | Protocol | Notes |
|------------|----------|-------|
| File system | Node.js `fs-extra` | All operations are local filesystem |
| npm/npx | Package distribution | Users invoke via `npx @caeruxlab/aidk` |
| GitLab Package Registry | npm registry | Publish via GitLab CI/CD pipeline |

## Error Handling

- All commands wrap operations in try/catch at the top level
- Filesystem errors (EACCES, ENOENT, ENOSPC) produce user-friendly messages
- User cancellation (@clack/prompts `isCancel()`) exits with code 2
- Missing `.ai-devkit.json` for `add`/`remove`/`update` suggests running `init` first
- Component not found in registry produces a list of available components

## Performance Considerations

- Template copying is I/O-bound; for ~50 files this completes in < 1 second
- Registry scan happens once at CLI startup (< 10ms for ~30 entries)
- No network calls — all operations are local
- `tsup` bundles to a single file, minimizing startup overhead

## Security Notes

- No authentication or authorization logic
- No user input beyond CLI args and prompted selections (no injection surface)
- No secrets management
- GitLab Package Registry auth handled by user's `.npmrc` (not managed by CLI)
- Templates are static markdown files (no executable code)
