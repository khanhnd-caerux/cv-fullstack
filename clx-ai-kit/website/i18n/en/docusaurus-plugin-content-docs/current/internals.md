---
id: internals
title: Project Internals & Contributing
sidebar_position: 5
description: Guide for contributors who want to understand or extend the AIDK codebase.
---

# Project Internals & Contributing

## Source Code Structure

```
ai-dev-kit/
├── src/
│   ├── index.ts          # CLI entry point (Commander.js)
│   ├── commands/         # CLI command handlers (init, add)
│   ├── generators/       # File generation logic from templates
│   └── utils/            # Utilities (file system, logging)
├── templates/            # Template files for rules/skills/workflows/docs
│   ├── rules/
│   ├── skills/
│   ├── workflows/
│   └── docs/
├── tests/                # Unit & integration tests (Vitest)
├── tsconfig.json
└── tsup.config.ts        # Build configuration
```

## How It Works

1. **CLI Entry point** (`src/index.ts`): Initializes Commander.js and registers subcommands.
2. **Command handler** (`src/commands/`): Handles logic for each command (`init`, `add`).
3. **Generator** (`src/generators/`): Reads templates from `templates/`, renders them, and writes to the filesystem.
4. **Templates** (`templates/`): Markdown/JSON template files that are copied into the user's project.

## Development Environment Setup

```bash
git clone https://git.caerux.com/caeruxlab/clx-ai-kit.git
cd clx-ai-kit
npm install
npm run dev    # Watch mode build
```

## Running Tests

```bash
npm test               # Run full test suite
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## Build

```bash
npm run build
```

Output will be generated in the `dist/` directory.

## Adding a New Command

1. Create a handler file in `src/commands/<command-name>.ts`.
2. Register the command in `src/index.ts`.
3. Add templates if needed to `templates/`.
4. Write tests in `tests/`.

## Lint & Type Check

```bash
npm run lint   # TypeScript type check (tsc --noEmit)
```

## Coding Rules

- **No `console.log`** — Use `picocolors` for CLI output formatting.
- **Small files** — Maximum 800 lines, ideally 200–400 lines.
- **Immutable patterns** — Do not mutate objects/arrays directly.
- **Named exports** — Prefer named exports over default exports in internal modules.
