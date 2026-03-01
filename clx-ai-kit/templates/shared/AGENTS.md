# AI DevKit Project

This project uses AI DevKit for structured, phase-based AI-assisted development.

## Documentation

Phase documentation lives in `docs/ai/` with these phases:

- `requirements/` — Problem understanding and requirements
- `design/` — Architecture and design decisions (include mermaid diagrams)
- `planning/` — Task breakdown and project planning
- `implementation/` — Implementation guides and notes
- `testing/` — Testing strategy and test cases
- `deployment/` — Deployment and infrastructure docs
- `monitoring/` — Monitoring and observability setup

Always review relevant phase docs before implementing features. Update them when requirements or design changes.

## Rules & Skills

Rules and skills are installed in environment-specific directories:

- **Cursor**: `.cursor/rules/`, `.cursor/skills/`, `.cursor/commands/`
- **Antigravity**: `.agent/rules/`, `.agent/skills/`, `.agent/workflows/`
- **Claude Code**: `.claude/rules/`, `.claude/skills/`, `.claude/commands/`

Read all relevant rules before starting any task. Read `SKILL.md` in each relevant skill directory before implementing.

## Mandatory Process

Before any creative or constructive work (features, components, architecture, behavior changes):

1. Read all rules that apply to the task
2. Read all relevant skills
3. Use the **brainstorming skill** (`cxl-brainstorming`) — complete the Understanding Lock and get confirmation before designing or implementing

## Development Workflow

- Start new features with requirements clarification, not code
- Use mermaid diagrams for architectural or data-flow visuals
- Write tests alongside implementation
- Follow the project's established code style and conventions
