# @caeruxlab/aidk

CLI tool to scaffold AI-assisted development structures for **Cursor**, **Antigravity** (Google IDE), and **Claude Code**.

Manages rules, skills, commands/workflows, and documentation templates across projects.

## Installation

### Prerequisites

- Node.js >= 24

### Configure npm for GitLab Package Registry

To install `@caeruxlab/aidk`, you need to configure your npm settings to point to the CaeruxLab GitLab Registry.

1.  **Generate a Personal Access Token (PAT):**
    *   Create a new token with name "AIDK".
    *   Under **Scopes** (or **Permissions**), select the **`api`** checkbox.
    *   Click "Create personal access token" at the bottom.
    *   Copy the generated token.

2.  **Add to your `~/.npmrc`:**

    Replace `YOUR_GITLAB_TOKEN` with the token you just generated:

```
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/
//git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/:_authToken=YOUR_GITLAB_TOKEN
```

### Install

```bash
npm install -g @caeruxlab/aidk
```

Or use directly with `npx`:

```bash
npx @caeruxlab/aidk init
```

### Update

```bash
npm install -g @caeruxlab/aidk
```

Or use directly with `npx`:

```bash
npx @caeruxlab/aidk update
```

## Commands

### `aidk init`

Initialize AI DevKit in the current project with interactive prompts.

> **Tip for interactive prompts**: Use **Up/Down arrows** to navigate, press **Space** to select or unselect an item, and press **Enter** to confirm your choices.

```bash
aidk init
aidk init --force  # overwrite existing configuration
```

Prompts for:
- Environment selection (Cursor, Antigravity, Claude Code, or multiple)
- Documentation phases to scaffold
- Skills to install

### `aidk add <type> <name>`

Add a single component to the project.

```bash
aidk add skill cxl-fastapi
aidk add command write-tests
aidk add rule coding-style
aidk add phase testing
```

### `aidk remove <type> <name>`

Remove a component with confirmation.

```bash
aidk remove skill cxl-ansible
aidk remove command debug
```

### `aidk list [type]`

Show available and installed components.

```bash
aidk list           # all component types
aidk list skills    # only skills
aidk list commands  # only commands
```

### `aidk update`

Update installed components to the latest bundled versions. Shows a diff summary and requires confirmation before overwriting any files.

```bash
aidk update
```

## Configuration

The CLI tracks project state in `.ai-devkit.json`:

```json
{
  "version": "1.0.0",
  "cliVersion": "0.1.0",
  "environments": ["cursor", "antigravity", "claude-code"],
  "initializedPhases": ["requirements", "design", "planning"],
  "installedSkills": ["cxl-brainstorming", "cxl-fastapi"],
  "installedCommands": ["new-requirement", "execute-plan"],
  "installedRules": ["0-force-rule", "3-coding-style"]
}
```

## IDE/Environment Directory Mapping

| Component | Cursor | Antigravity | Claude Code |
|-----------|--------|-------------|-------------|
| Skills | `.cursor/skills/{name}/` | `.agent/skills/{name}/` | `.claude/skills/{name}/` |
| Commands | `.cursor/commands/{name}.md` | `.agent/workflows/{name}.md` | `.claude/commands/{name}.md` |
| Rules | `.cursor/rules/{name}.mdc` | `.agent/rules/{name}.md` | `.claude/rules/{name}.md` |
| Phases | `docs/ai/{name}/` | `docs/ai/{name}/` | `docs/ai/{name}/` |
| Memory | `AGENTS.md` | (uses IDE context) | `CLAUDE.md` |

## Development

```bash
npm install
npm run build
npm link        # link locally for testing
npm test        # run tests
npm run lint    # type check
npm unlink -g @caeruxlab/aidk      # unlink for production
```

## License

MIT