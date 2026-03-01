---
id: cli-usage
title: CLI Reference
sidebar_position: 3
description: Full reference for all AIDK CLI commands.
---

# CLI Reference

## Command Overview

```bash
aidk [command] [options]
```

| Command | Description |
|---------|-------------|
| `aidk init` | Initialize AIDK structure in the current project |
| `aidk add rule <name>` | Add a new rule |
| `aidk add skill <name>` | Add a new skill |
| `aidk add workflow <name>` | Add a new workflow |
| `aidk update` | Check and update components from the registry |
| `aidk --version` | Print current version |
| `aidk --help` | Display help |

## `aidk init`

Initialize AIDK in the current directory.

> **Tip for interactive prompts**: Use **Up/Down arrows** to navigate, press **Space** to select or unselect an item, and press **Enter** to confirm your choices.

```bash
aidk init
```

**Options:**
- `--ide <cursor|antigravity|claude-code>` — Target IDE (default: `antigravity`)
- `--force` — Overwrite if structure already exists

**Examples:**

```bash
# Initialize for Cursor IDE
aidk init --ide cursor

# Overwrite existing structure
aidk init --force
```

## `aidk add rule`

Add a new rule file to `.agent/rules/`.

```bash
aidk add rule <name>
```

**Example:**

```bash
aidk add rule security
# Creates: .agent/rules/security.md
```

## `aidk add skill`

Add a new skill to `.agent/skills/`.

```bash
aidk add skill <name>
```

**Example:**

```bash
aidk add skill fastapi
# Creates: .agent/skills/fastapi/SKILL.md
```

## `aidk add workflow`

Add a new workflow to `.agent/workflows/`.

```bash
aidk add workflow <name>
```

**Example:**

```bash
aidk add workflow deploy
# Creates: .agent/workflows/deploy.md
```

## `aidk update`

Check for changes in installed components and discover new components from the registry.

```bash
aidk update
```

This command performs the following actions:

1.  **Check for Changes**: Compares the current rules, skills, and workflows in your project with the latest versions in the AIDK registry.
2.  **Discover New Components**: Automatically identifies new components (rules, skills, workflows) available in the registry that you haven't installed yet.
3.  **Selective Update**: Provides an interactive interface for you to choose whether to update everything or select specific components.

**Example:**

```bash
# Check and update the entire project
aidk update
```

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Command not found: aidk` | Not installed or PATH not set | Run `npm install -g @caeruxlab/aidk` |
| `ENOENT: .agent already exists` | Directory already exists | Use `--force` flag |
| `403 Forbidden` | npm registry auth error | Check `.npmrc` and GitLab token |
