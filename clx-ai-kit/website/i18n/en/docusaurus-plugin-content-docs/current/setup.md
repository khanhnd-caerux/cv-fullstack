---
id: setup
title: Installation & Setup
sidebar_position: 2
description: Step-by-step guide for installing AIDK CLI and initializing a project structure.
---

# Installation & Setup

## System Requirements

- **Node.js** >= 24
- **npm** >= 10

## Global Installation

```bash
npm install -g @caeruxlab/aidk
```

If you are using the CaeruxLab GitLab registry, configure `.npmrc` first:

1.  **Generate a Personal Access Token (PAT):**
    *   Log in to your GitLab account.
    *   Go to **User Settings** (User avatar dropdown) -> **Access Tokens**.
    *   Create a new token with name "AIDK".
    *   Under **Scopes** (or **Permissions**), select the **`api`** checkbox.
    *   Click "Create personal access token" at the bottom.
    *   Copy the generated token.

2.  **Configure `.npmrc`:**

    Add the following to your `~/.npmrc` or project-level `.npmrc`, replacing `YOUR_GITLAB_TOKEN` with the token you just generated:

```bash
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/
//git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/:_authToken=YOUR_GITLAB_TOKEN
```

Then install:

```bash
npm install -g @caeruxlab/aidk
```

## Verify Installation

```bash
aidk --version
```

## Initialize a Project

Inside your project root, run:

```bash
aidk init
```

This will:
1. Create the `.agent/` directory with rules, skills, and workflows structure.
2. Create the `docs/ai/` directory with documentation templates.
3. Create a `.ai-devkit.json` configuration file.

## Resulting Project Structure

```
your-project/
├── .agent/
│   ├── rules/          # AI guidance rules
│   ├── skills/         # Specialized AI skills
│   └── workflows/      # Slash command workflows
├── docs/
│   └── ai/
│       ├── requirements/
│       ├── design/
│       ├── planning/
│       ├── implementation/
│       └── testing/
└── .ai-devkit.json
```

## `.ai-devkit.json` Configuration

This file stores project-level AIDK configuration:

```json
{
  "version": "1.0.0",
  "cliVersion": "0.1.0",
  "environments": ["cursor", "antigravity", "claude-code"]
}
```

| Field | Description |
|-------|-------------|
| `version` | Config version |
| `cliVersion` | AIDK CLI version |
| `environments` | Target environments (`cursor`, `antigravity`, `claude-code`) |
