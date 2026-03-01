---
phase: requirements
title: Requirements & Problem Understanding - Project Documentation
description: Clarify the problem space, gather requirements, and define success criteria for the AIDK project documentation site.
---

# Requirements & Problem Understanding

**Related docs**: [Design](../design/feature-project-documentation.md) | [Planning](../planning/feature-project-documentation.md) | [Implementation](../implementation/feature-project-documentation.md) | [Testing](../testing/feature-project-documentation.md)
**Applicable rules/skills**: `cxl-brainstorming`, `cxl-docusaurus-setup`

## Problem Statement
**What problem are we solving?**
The `aidk` CLI tool lacks a structured, navigable, and centralized documentation site. This causes friction for both end-users trying to use the CLI and internal contributors trying to understand project internals, rules, skills, CI/CD setups, and publishing workflows. Not solving this leads to decreased adoption, higher onboarding time, and inconsistent usage of the dev kit.

**Current workaround**: Users and contributors must navigate raw Markdown files in the GitLab repository directly, which requires repository access and knowledge of the internal directory structure.

## Stakeholders
**Who needs to be involved?**
- **Owner / Approver**: Project maintainer (CaeruxLab team) — responsible for approving documentation structure and long-term maintenance.
- **End-users**: Developers who install and use the `aidk` CLI.
- **Contributors / SMEs**: Any contributor who adds new rules, skills, or workflows — they are directly affected by the Docusaurus contributor guide.
- **Maintainers**: Team members managing releases, CI/CD, and the GitLab Package Registry.

## Goals & Objectives
**What do we want to achieve?**
- **Primary:** Create a comprehensive, easily navigable documentation site using Docusaurus.
- **Primary:** Document the following key areas: Setup & Installation, CLI Usage/Command Reference, Internals/Contributor Guide, Examples, Publishing workflow, Rules/Skills details, and GitLab config.
- **Primary:** Provide a comprehensive guide for internal contributors on how to work with Docusaurus (setup, configuration, adding new pages, managing translations).
- **Primary:** Support Internationalization (i18n) natively with Vietnamese (primary), English, and Japanese.
- **Primary:** Provide an offline-capable, fast client-side search component.

## Non-Goals & Scope Boundaries
**What is explicitly out of scope?**
- Dynamic, server-rendered documentation.
- User authentication or gated content on the documentation site.
- Moving the `aidk` CLI package to a monorepo workspace structure (we are utilizing a separate `website/` directory).

## User Stories & Use Cases
**How will users interact with the solution?**

| Priority | User type | Story | Notes |
|----------|-----------|-------|-------|
| P0 | End User | As an end-user, I want to read the CLI setup and usage guide so that I can scaffold AI dev kits quickly. | |
| P0 | Contributor | As a contributor, I want to read the internals guide so that I can add new rules and skills. | |
| P0 | Maintainer | As a maintainer, I want to see the publishing and GitLab CI configuration guide so I can manage releases reliably. | |
| P1 | Contributor | As a contributor, I want a guide on how to add pages and manage translations so I can maintain the documentation easily. | |
| P1 | Global User | As a non-Vietnamese speaking user, I want to switch the language to English or Japanese to understand the tool natively. | |
| P1 | Reader | As a reader, I want to search for specific commands or skills and find the relevant page instantly. | |

### Unhappy Paths & Edge Cases

| Scenario | Expected behaviour |
|----------|-------------------|
| User searches a term with no matching results | Search UI shows a clear "No results found" message with no broken UI. |
| User switches language on a page not yet translated | Docusaurus falls back to the default locale (`vi`) gracefully rather than showing a 404. |
| GitLab Pages deployment pipeline fails | The previously deployed site remains live; the failure is surfaced in the GitLab CI pipeline view. |
| User accesses the site from a locale URL directly (e.g. `/ja/`) | The correct language renders without a redirect loop. |

## Success Criteria
**How will we know when we're done?**

| Criteria | Target | How to measure |
|----------|--------|----------------|
| Docusaurus init | Complete | `website/` dir exists and builds locally. |
| Supported locales | vi, en, ja | Language switcher is visible and works for all three locales. |
| Documentation content | All sections covered | VI default content populated matching the goals above. |
| Docusaurus Guide | Comprehensive | `docusaurus-guide.md` is created, translated, and explains setup, config, and page addition flows. |
| Global Search | Functional | Using `@easyops-cn/docusaurus-search-local` works in all languages. |
| CI/CD Deployment | Pipeline pass | GitLab CI/CD builds the static site successfully. |

## Non-Functional Requirements
**What quality attributes matter?**

- **Performance**: Static HTML/JS via Docusaurus ensures fast loading times across devices.
- **Scale**: N/A for static site scaling, GitLab Pages handles CDN routing.
- **Security/Privacy**: Public static site. No PII or authentication mechanisms required.
- **Reliability/Availability**: Inherited from the hosting provider (GitLab Pages).
- **Maintenance**: Documentation source files live alongside the CLI code in the `website/` folder to ensure they evolve concurrently.

## Constraints & Assumptions
**What limitations do we need to work within?**
- We assume `Node.js >= 24` based on the current CLI toolkit `package.json`. _Invalidated if_: the GitLab CI runner uses an older Node.js image — the build will fail and the image tag must be updated.
- Approach 1 (Isolated `website/` dir) is used instead of a complex monorepo setup to prefer simplicity and adhere to YAGNI principles. _Invalidated if_: a second package requiring shared tooling is added to the repo, at which point `npm workspaces` should be reconsidered.
- We assume GitLab Pages is enabled and accessible for the project. _Invalidated if_: the instance disables Pages or enforces a custom domain — deployment target would need to change.

## Dependencies
**What external factors does this feature rely on?**
- `@easyops-cn/docusaurus-search-local` plugin.
- GitLab CI/CD for deployments.

## Questions & Open Items
**What do we still need to clarify?**
- ~~Detailed CI/CD steps depending on whether we deploy to GitLab Pages directly or a separate environment.~~ ✅ Resolved: GitLab Pages `pages` job implemented in `.gitlab-ci.yml`.
- **[Open]** Who owns ongoing translation maintenance (EN/JA) when new documentation pages are added? Is there a defined process for keeping translations in sync? (Owner: CaeruxLab maintainer. Target: define before first public release.)
