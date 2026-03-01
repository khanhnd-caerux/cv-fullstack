---
phase: requirements
title: "Migrate from GitHub to GitLab (git.caerux.com)"
description: Replace GitHub as the source repository and GitHub Packages as the npm registry with a self-managed GitLab instance and GitLab Package Registry
feature: github-to-gitlab
created: 2026-02-23
---

# Requirements: Migrate from GitHub to GitLab

**Related docs**: [Design](../design/feature-github-to-gitlab.md) | [Planning](../planning/feature-github-to-gitlab.md) | [Implementation](../implementation/feature-github-to-gitlab.md) | [Testing](../testing/feature-github-to-gitlab.md)

## Problem Statement

**What problem are we solving?**

- The project currently lives on `github.com/anhvt2280/ai-dev-kit` and publishes the `@anhvt2280/aidk` npm package to **GitHub Packages** (`npm.pkg.github.com`)
- The team's canonical source control platform is a **self-managed GitLab instance** at `git.caerux.com`
- All developer tooling, CI/CD pipelines, and package distribution should be co-located on GitLab to avoid split maintenance across two platforms
- GitHub-specific constructs (`.github/workflows/`, `npm.pkg.github.com`, `github.com` URLs, GitHub PATs) are embedded throughout the codebase, documentation, and `package.json`

**Who is affected?** The sole maintainer (`@anhvt2280`) and downstream consumers who install `@anhvt2280/aidk` from GitHub Packages.

**Cost of not solving:** Ongoing friction maintaining two platforms; CI/CD workflows will be built on GitHub Actions instead of GitLab CI; consumers must configure `npm.pkg.github.com` rather than the GitLab registry.

## Stakeholders

- **Owner / Maintainer**: `@anhvt2280` (caeruxlab group)
- **Users**: Developers who install and use `@caeruxlab/aidk` via npm

## Goals & Objectives

**Primary goals (must ship):**

1. Move source repository to `https://git.caerux.com/caeruxlab/clx-ai-kit`
2. Change npm package scope from `@anhvt2280` to `@caeruxlab`
3. Publish the package to the **GitLab Package Registry** at project level (`/caeruxlab/clx-ai-kit`) as a **private** package
4. Replace `.github/workflows/publish.yml` with a `.gitlab-ci.yml` pipeline that publishes on tag push
5. Update `package.json` (`publishConfig`, `repository`) to point to GitLab
6. Update `README.md` and `PUBLISHING.md` to reflect GitLab-based workflow (install instructions, token setup, release process)
7. Update existing feature documentation (`feature-cli-tool.md` across all phases) to remove GitHub-specific references

**Secondary goals (deferrable):**

- Add GitLab CI badge to README
- Configure GitLab project-level deploy tokens as an alternative to personal access tokens for CI-less consumers

## Non-Goals & Scope Boundaries

- **No changes to CLI commands** (`init`, `add`, `remove`, `list`, `update`) — functionality is unchanged
- **No changes to template content** — skill/command/rule templates remain identical
- **Third-party `github.com` references** inside templates (e.g., Terraform docs, gitignore templates, Supabase links) are **out of scope** — those reference upstream open-source projects, not this distribution
- No migration of git history transformation (a fresh push to the new remote is sufficient)
- No multi-registry support (not publishing to both GitHub Packages and GitLab simultaneously)
- No changes to the `.ai-devkit.json` schema

## User Stories & Use Cases

| Priority | User type | Story | Notes |
|----------|-----------|-------|-------|
| P0 | Maintainer | As maintainer, I want to push commits and tags to `git.caerux.com/caeruxlab/clx-ai-kit` and have the CI pipeline publish the npm package automatically | Replaces GitHub Actions publish workflow |
| P0 | Developer | As a developer, I want to install `@caeruxlab/aidk` from the GitLab Package Registry using a GitLab PAT configured in `~/.npmrc` | Replaces GitHub PAT + `npm.pkg.github.com` |
| P0 | Developer | As a developer, I want `npx @caeruxlab/aidk init` to work after configuring the registry | New scope must resolve correctly |
| P1 | Maintainer | As maintainer, I want `PUBLISHING.md` to document the GitLab-specific workflow end-to-end | Replaces GitHub Packages publishing guide |
| P1 | Developer | As a developer, I want `README.md` to show the correct GitLab-based install instructions | Entry point for new users |

**Unhappy paths and edge cases:**

- Developer attempts to install using old `@anhvt2280` scope — must fail gracefully (npm 404); README must clearly state the new scope
- CI job token expires or is missing `write_package_registry` scope — pipeline fails with actionable error message
- Tag is pushed but `package.json` version is not bumped — pipeline should fail version validation (or publish a duplicate version which GitLab rejects)

## Success Criteria

| Criteria | Target | How to measure |
|----------|--------|----------------|
| Source repo accessible at GitLab URL | `git.caerux.com/caeruxlab/clx-ai-kit` resolves and `git clone` works | Manual verification |
| Package published to GitLab registry | `@caeruxlab/aidk` visible in project Package Registry | GitLab UI + `npm view @caeruxlab/aidk` |
| CI pipeline publishes on tag push | `.gitlab-ci.yml` pipeline passes on `v*` tag | GitLab CI pipeline log |
| Install works with GitLab token | `npm install @caeruxlab/aidk` succeeds with `.npmrc` configured | Manual test in fresh directory |
| `npx @caeruxlab/aidk --version` returns version | Correct version string printed | Manual test |
| `README.md` reflects GitLab workflow | No `npm.pkg.github.com` references remain in README | grep / code review |
| `PUBLISHING.md` reflects GitLab workflow | All steps refer to GitLab UI, GitLab tokens, `.gitlab-ci.yml` | Manual review |

## Non-Functional Requirements

- **Performance**: No change — local CLI tool, no network calls at runtime
- **Scale**: Single-user CLI tool; no concurrency concerns
- **Security/Privacy**: Package remains private. Authentication uses GitLab Personal Access Token (scope: `read_package_registry` / `write_package_registry`) or CI Job Token. No tokens committed to the repository
- **Reliability/Availability**: GitLab instance is self-managed at `git.caerux.com`; availability depends on the hosting team. Manual publish fallback must be documented
- **Maintenance**: Sole maintainer. Adding a new template to `templates/` still auto-discovers it — no registry changes needed

## Constraints & Assumptions

- **GitLab instance**: Self-managed at `git.caerux.com`; assumed to have the Package Registry feature enabled
- **Project path**: `caeruxlab/clx-ai-kit`
- **npm scope**: `@caeruxlab`
- **Registry URL** (project-level): `https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/`
- **Visibility**: Package is private; consumers need a GitLab PAT with `read_package_registry` scope
- **Assumption**: Node.js >= 24 still required (unchanged)
- **Assumption**: The GitLab Package Registry supports scoped npm packages on this instance version
- **Assumption**: CI Job Token (`$CI_JOB_TOKEN`) has write access to the project's Package Registry in the GitLab CI environment

## Dependencies

- GitLab instance at `git.caerux.com` with Package Registry enabled
- GitLab project `caeruxlab/clx-ai-kit` created (or to be created as part of this feature)
- Developer GitLab PAT with `write_package_registry` scope (for manual publish)
- CI runner available in the GitLab project

## Questions & Open Items

- Is the GitLab Package Registry feature enabled on `git.caerux.com`? *(Verify before implementation)*
- Should `aidk init` generate a project-level `.npmrc` snippet pointing to the GitLab registry to help users configure their environment? *(Deferred — not in this feature)*
- Will existing consumers of `@anhvt2280/aidk` need a migration period or deprecation notice? *(Out of scope if there are no other consumers beyond the maintainer)*
