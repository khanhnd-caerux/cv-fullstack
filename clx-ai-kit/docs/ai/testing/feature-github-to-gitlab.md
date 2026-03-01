---
phase: testing
title: "GitHub → GitLab Migration — Testing Strategy"
description: Verification plan for the GitHub to GitLab migration
feature: github-to-gitlab
created: 2026-02-23
---

# Testing Strategy: GitHub → GitLab Migration

**Related docs**: [Requirements](../requirements/feature-github-to-gitlab.md) | [Design](../design/feature-github-to-gitlab.md) | [Planning](../planning/feature-github-to-gitlab.md) | [Implementation](../implementation/feature-github-to-gitlab.md)

## Test Coverage Goals

| Test level | Scope | Coverage target |
|-----------|-------|----------------|
| Unit | No code logic changes; existing unit tests sufficient | 100% (existing suite unchanged) |
| Integration | GitLab CI pipeline execution end-to-end, registry publish | Critical path: tag push → publish → install |
| Manual | Install from registry, npx invocation, PUBLISHING.md walkthrough | All user stories from requirements |

> Since this migration changes **no CLI source code**, the primary validation is integration and manual testing of the distribution pipeline.

## Unit Tests

No new unit tests required. The existing Vitest test suite covers CLI logic and must continue to pass.

### Existing Test Suite (must remain green)

| Test case | Scenario | Expected result | Priority | Status |
|-----------|----------|----------------|----------|--------|
| All existing tests | Run `npm test` | 0 failures | P0 | [ ] |
| TypeScript types | Run `npm run lint` | 0 errors | P0 | [ ] |

## Integration Tests

### GitLab CI Pipeline

| Scenario | Components involved | Setup | Expected behavior | Status |
|----------|-------------------|-------|-------------------|--------|
| Push to `main` | Git push → GitLab CI → `test` stage | Code pushed to GitLab remote | `test` stage passes; `publish` stage skipped (no tag) | [ ] |
| Push `v0.2.0` tag | Git tag → GitLab CI → `test` + `publish` stages | Tag created with `npm version minor` | Both stages pass; package appears in GitLab Package Registry | [ ] |
| Duplicate version publish | Push same tag twice (or publish existing version) | Tag `v0.2.0` already published | Pipeline fails with `409 Conflict`; existing package unaffected | [ ] |

### Package Registry

| Scenario | Components involved | Setup | Expected behavior | Status |
|----------|-------------------|-------|-------------------|--------|
| Package visible in UI | GitLab project → Package Registry tab | After first publish | `@caeruxlab/aidk @ 0.2.0` visible | [ ] |
| `npm view` resolves package | npm client → GitLab registry | `~/.npmrc` configured | Returns package metadata with correct version | [ ] |
| `npm install` succeeds | npm client → GitLab registry | `~/.npmrc` configured with valid PAT | Package installs; `node_modules/@caeruxlab/aidk/` exists | [ ] |
| Unauthenticated install fails | npm client → GitLab registry | No `~/.npmrc` or expired token | Returns `401 Unauthorized` (not a silent failure) | [ ] |

## End-to-End Tests

Map to user stories from requirements doc.

| User story | Flow | Steps | Expected outcome | Status |
|-----------|------|-------|-----------------|--------|
| P0 — CI publish on tag | Maintainer pushes `v0.2.0` tag | 1. `npm version minor` 2. `git push origin main --follow-tags` 3. Monitor pipeline | Pipeline green; package in registry | [ ] |
| P0 — Developer install | Developer installs `@caeruxlab/aidk` | 1. Configure `~/.npmrc` 2. `npm install @caeruxlab/aidk` in fresh dir | Package installs successfully | [ ] |
| P0 — npx invocation | Developer uses `npx @caeruxlab/aidk init` | 1. `~/.npmrc` configured 2. `npx @caeruxlab/aidk --version` | Correct version string printed | [ ] |
| P1 — README accuracy | New developer follows README | Follow README install section top-to-bottom | Succeeds without additional steps | [ ] |
| P1 — PUBLISHING.md accuracy | Maintainer follows publishing guide | Follow PUBLISHING.md first-publish steps | Succeeds end-to-end | [ ] |

## Test Data

- **Tag**: `v0.2.0` — first GitLab release
- **Test directory**: `~/Desktop/test-caeruxlab/` (fresh, no existing `node_modules`)
- **Test `.npmrc`**: configured at `~/.npmrc` with a real GitLab PAT (not committed)
- No PII or sensitive data in tests

## Test Reporting & Coverage

```bash
# Run existing unit and type tests
npm test
npm run lint

# Confirm package size is within target
npm pack --dry-run | grep 'package size'
```

| Check | Target | Status |
|-------|--------|--------|
| `npm test` | 0 failures | [ ] |
| `npm run lint` | 0 TypeScript errors | [ ] |
| Package size | < 5MB | [ ] |
| GitLab CI pipeline | All stages green on tag push | [ ] |

## Manual Testing Checklist

### Pre-Publish
- [ ] `npm run build` succeeds locally
- [ ] `npm run lint` has no errors
- [ ] `npm test` has 0 failures
- [ ] `package.json` `name` is `@caeruxlab/aidk`
- [ ] `package.json` `version` is bumped from previous

### Registry & Install
- [ ] `~/.npmrc` configured with GitLab PAT for `@caeruxlab` scope
- [ ] `npm install @caeruxlab/aidk` succeeds in a fresh directory
- [ ] `npx @caeruxlab/aidk --version` prints correct version
- [ ] `npx @caeruxlab/aidk init` launches interactive prompt correctly
- [ ] `npx @caeruxlab/aidk list` shows available components

### Documentation Audit
- [ ] `README.md` contains no `npm.pkg.github.com` references
- [ ] `README.md` contains no `@anhvt2280` scope references
- [ ] `README.md` contains no `github.com/anhvt2280` repository links
- [ ] `PUBLISHING.md` contains no GitHub Actions / `.github/workflows/` references
- [ ] `package.json` `publishConfig.registry` points to `git.caerux.com`
- [ ] `package.json` `repository.url` points to `git.caerux.com`

### CI/CD
- [ ] Push a commit to `main`: verify only `test` stage runs (no `publish`)
- [ ] Push a `v*` tag: verify both `test` and `publish` stages run and pass
- [ ] Package visible in GitLab UI: `git.caerux.com/caeruxlab/clx-ai-kit/-/packages`

## Security Testing

- [ ] **No committed tokens**: `grep -r "glpat-\|ghp_\|_authToken" . --exclude-dir=node_modules` returns no results in committed files
- [ ] **Unauthenticated install returns 401**: Remove token from `.npmrc` and attempt install
- [ ] **`npm audit`**: No high/critical vulnerabilities in dependencies before publishing

## Known Issues & Deferred Tests

| Gap | Reason deferred | Risk if untested |
|-----|-----------------|-----------------|
| Automated E2E in CI (install test) | Requires a second GitLab runner with a deploy token configured | Low — covered by manual test |
| Old `@anhvt2280` scope deprecation notice | No other known consumers | Low |
