# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2026-02-25

### Added

- **CLI**: Support for multiple IDE environments simultaneously. `aidk init` now correctly merges new IDE selections with existing ones without overwriting.
- **Documentation**: Completed full documentation stack for the multi-IDE support feature in `docs/ai/`.

## [0.5.0] - 2026-02-25

### Added

- **Environments**: Added full scaffolding support for Claude Code CLI (`.claude/skills/`, `.claude/commands/`, `.claude/rules/`, and `CLAUDE.md`).
- **Documentation**: Created `docs/ai/` documentation covering requirements, design, planning, implementation, and testing for Claude Code integration and `AGENTS.md` improvements.
- **Project Scaffold**: Updated interactive setup menus to provide clear keyboard mapping and allow multiple environment selection.
- **Website**: Re-built and updated Docusaurus references to introduce Claude Code features across multi-lingual (English, Japanese, Vietnamese) locales.
- **Templates**: Improved `AGENTS.md` instructions dynamically and centralized project memory behavior.

## [0.4.0] - 2026-02-24

### Added

- **Skills**: Added `cxl-report-po` skill to help generate structured PA/DA reports from Notion contexts.
- **Workflows**: Added `create-report-po.md` workflow for interactive PA/DA reporting via the CLI.
- **Documentation**: Updated website documentation (English, Vietnamese, and Japanese) to include the new reporting capabilities.

## [0.3.5] - 2026-02-24

### Added

- **Workflows**: Added `make-release.md` workflow to automate the release process, including version detection, build verification, and changelog updates.

## [0.3.4] - 2026-02-24

### Changed

- **CLI**: The command-line interface now automatically displays the full help menu when an unknown or invalid option is provided, improving developer experience.

## [0.3.3] - 2026-02-24

### Added

- **Documentation**: Added detailed, step-by-step instructions on how to obtain and configure a GitLab Personal Access Token (PAT) with `api` scope.
- **I18n**: Added Japanese translation for the website's Installation & Setup guide (`setup.md`).
- **README**: Full synchronization of `README.vi.md` with `README.md` structure and content.

## [0.3.2] - 2026-02-23

### Changed

- **CLI**: Internal improvements and minor bug fixes for the release process.

## [0.3.1] - 2026-02-23

### Fixed

- **CLI**: Fixed `aidk update` crash (EISDIR) when comparing directory-based components like skills and phases.
- **CLI**: Improved error handling in `update` command to show actual error details instead of a generic message.

## [0.3.0] - 2026-02-23

### Added

- **Command Template**: Added `update-requirement` to the CLI's bundled command templates.
- **Documentation**: Initialized project-specific documentation structure under `docs/ai/` (Requirements, Design, Planning, Implementation, Testing) for the "Project Documentation" feature.
- **Website**: Scaffolded a new Docusaurus-based documentation website in the `website/` directory with i18n support.
- **Workflows**: Added internal `update-requirement.md` workflow for agentic assistance.

### Changed

- **Infrastructure**: Updated GitLab CI configuration (`.gitlab-ci.yml`) for package publishing.
- **Git**: Updated `.gitignore` to include docusaurus build artifacts and cache.

## [0.2.0] - 2026-02-23

### Changed

- **Migration**: Moved source repository from GitHub to self-managed GitLab (`git.caerux.com/caeruxlab/clx-ai-kit`)
- **npm Scope**: Changed package scope from `@anhvt2280` to `@caeruxlab`
- **Distribution**: Switched npm registry from GitHub Packages to GitLab project-level Package Registry
- **CI/CD**: Replaced GitHub Actions with GitLab CI (`.gitlab-ci.yml`)
- Update all project documentation to reflect the new GitLab-based workflow

## [0.1.0] - 2026-02-23

### Added

- `aidk init` — interactive project scaffolding with IDE selection (Cursor, Antigravity), phase selection, and skill selection
- `aidk add <type> <name>` — add individual skills, commands, rules, or doc phases
- `aidk remove <type> <name>` — remove components with confirmation prompt
- `aidk list [type]` — show available and installed components with status indicators
- `aidk update` — update installed components to latest bundled versions with file-by-file confirmation before overwriting
- Component registry auto-discovers 15 skills, 13 commands, 3 rules, and 7 doc phases from bundled templates
- Cursor IDE support (`.cursor/commands/`, `.cursor/rules/*.mdc`, `.cursor/skills/`)
- Antigravity (Google IDE) support (`.agent/workflows/`, `.agent/rules/*.md`, `.agent/skills/`)
- `.ai-devkit.json` config tracking for installed components, environments, and CLI version
- Plural type normalization (`skills` accepted as `skill`, etc.)
- Graceful error handling: missing config, invalid types, already-installed, not-installed, user cancellation
