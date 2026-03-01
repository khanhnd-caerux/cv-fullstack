---
id: rules-skills
title: Rules & Skills
sidebar_position: 6
description: Detailed explanation of the Rules and Skills system in AIDK.
---

# Rules & Skills

AIDK uses two key mechanisms to guide the AI: **Rules** and **Skills**. Both reside in the `.agent/` directory.

## Rules

Rules are `.md` files in `.agent/rules/`. The AI reads them before **every task** to understand project constraints and standards.

### Rule Structure

```markdown
# Rule Name

## Description
Brief description of what this rule enforces.

## Mandatory Guidelines
- Rule 1
- Rule 2

## Correct Example
...

## Incorrect Example
...
```

### Default Rules

| Rule | Priority | Description |
|------|----------|-------------|
| `0-force-rule.md` | 0 (highest) | Forces the AI to review all rules/skills before starting any task |
| `2-dotenv-environments.md` | 2 | Environment variable configuration standards using `.env` files |
| `3-coding-style.md` | 3 | Coding style rules (file size limits, immutability, etc.) |

### Priority Order

Rules with lower numbers take precedence. For example, `0-force-rule.md` is always applied first.

---

## Skills

Skills are directories in `.agent/skills/`, each containing at least a `SKILL.md` file. Skills provide **technology-specific or task-specific** guidance.

### Skill Structure

```
.agent/skills/
└── my-skill/
    ├── SKILL.md        # Main instructions (required)
    ├── examples/       # Reference examples (optional)
    └── templates/      # File templates (optional)
```

### `SKILL.md` Frontmatter

```yaml
---
name: my-skill
description: >
  Describe when this skill should be used.
  The AI reads this to decide whether to apply the skill.
---
```

### Available Skills

| Skill | When to use |
|-------|-------------|
| `cxl-brainstorming` | Before any creative/constructive work |
| `cxl-fastapi` | Building REST APIs with FastAPI |
| `cxl-docusaurus-setup` | Creating/updating Docusaurus doc sites |
| `cxl-terraform` | Working with Terraform/OpenTofu |
| `cxl-ansible` | Writing Ansible playbooks |
| `cxl-postgres-patterns` | Schema design and PostgreSQL queries |
| `cxl-dynamodb` | DynamoDB data modeling |
| `cxl-aws-architecture` | Designing AWS architectures |
| `cxl-security-review` | Security review when adding auth/APIs |
| `cxl-python` | Python coding standards |
| `cxl-coding-standards` | TypeScript/JavaScript/React standards |
| `cxl-seo` | SEO optimization |
| `cxl-gitignore` | Create/update `.gitignore` files |
| `cxl-report-po` | Create structured PA/DA reports |

### Creating a New Skill

```bash
aidk add skill my-new-skill
# Creates: .agent/skills/my-new-skill/SKILL.md
```

Then edit `SKILL.md` according to your project's specific needs.

---

## Workflows

Workflows are `.md` files in `.agent/workflows/` that define slash-command-driven processes.

### Default Workflows

| Workflow | Slash command | Description |
|----------|--------------|-------------|
| `new-requirement.md` | `/new-requirement` | Generate docs from requirements to planning |
| `execute-plan.md` | `/execute-plan` | Step-by-step execution of a feature plan |
| `code-review.md` | `/code-review` | Code review before pushing |
| `debug.md` | `/debug` | Root cause analysis before code changes |
| `write-tests.md` | `/write-tests` | Write tests for a new feature |
| `create-report-po.md` | `/create-report-po` | Create PA/DA report from Notion |
