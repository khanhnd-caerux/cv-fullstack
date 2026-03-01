---
phase: implementation
title: "GitHub → GitLab Migration — Implementation Guide"
description: Step-by-step implementation instructions for migrating the aidk package from GitHub to GitLab
feature: github-to-gitlab
created: 2026-02-23
---

# Implementation Guide: GitHub → GitLab Migration

**Related docs**: [Requirements](../requirements/feature-github-to-gitlab.md) | [Design](../design/feature-github-to-gitlab.md) | [Planning](../planning/feature-github-to-gitlab.md) | [Testing](../testing/feature-github-to-gitlab.md)

## Development Setup

No new runtime dependencies. Standard setup:

```bash
# Clone from GitLab (after migration)
git clone https://git.caerux.com/caeruxlab/clx-ai-kit.git
cd clx-ai-kit

# Install dependencies
npm install

# Build
npm run build

# Test
npm test
```

### Environment Configuration

No `.env` file required — this is a CLI tool with no server runtime.

For **local npm publishing** (manual), configure `~/.npmrc` globally (never commit):

```
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/
//git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/:_authToken=YOUR_GITLAB_TOKEN
```

For **CI publishing**, a project-level `.npmrc` (committed, using CI environment variables):

```
# .npmrc (committed — no real tokens)
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/${CI_PROJECT_ID}/packages/npm/
//git.caerux.com/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}
```

## Code Structure

No structural changes to `src/`. All changes are configuration and documentation files:

```
clx-ai-kit/
├── .gitlab-ci.yml          # NEW — replaces .github/workflows/publish.yml
├── .npmrc                  # NEW — CI registry config (no real tokens)
├── package.json            # UPDATED — scope, publishConfig, repository
├── README.md               # UPDATED — install instructions
├── PUBLISHING.md           # UPDATED — full GitLab-based workflow
├── CHANGELOG.md            # UPDATED — migration entry
└── docs/ai/
    ├── requirements/feature-cli-tool.md   # UPDATED — remove GitHub Packages refs
    ├── design/feature-cli-tool.md         # UPDATED — Decision #3, security section
    └── implementation/feature-cli-tool.md # UPDATED — clone URL, publish steps
```

## Implementation Notes

### 1. `package.json` Changes

```json
{
  "name": "@caeruxlab/aidk",
  "publishConfig": {
    "registry": "https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/"
  },
  "repository": {
    "type": "git",
    "url": "https://git.caerux.com/caeruxlab/clx-ai-kit.git"
  }
}
```

### 2. `.gitlab-ci.yml` — Full Implementation

```yaml
# .gitlab-ci.yml
image: node:24-alpine

stages:
  - test
  - publish

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

test:
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm test
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'

publish:
  stage: publish
  script:
    - npm ci
    - npm run build
    - npm publish
  rules:
    - if: '$CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+/'
  environment:
    name: npm-registry
```

> **How auth works**: `.npmrc` in the project root uses `${CI_JOB_TOKEN}` which GitLab injects automatically. No manual secret configuration needed for publish.

### 3. `.npmrc` (committed, CI-safe)

```
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/${CI_PROJECT_ID}/packages/npm/
//git.caerux.com/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}
```

### 4. Push to GitLab Remote

```bash
# Add the GitLab remote (keep GitHub remote if needed for reference)
git remote add origin https://git.caerux.com/caeruxlab/clx-ai-kit.git

# Push all branches and tags
git push origin main --follow-tags
```

### 5. First Publish (Manual Verification)

```bash
# Configure ~/.npmrc with your GitLab PAT first
npm run build
npm publish

# Verify
npm view @caeruxlab/aidk
```

### 6. Release Workflow (After Migration)

```bash
# 1. Bump version (updates package.json + creates git tag)
npm version minor   # 0.1.0 → 0.2.0

# 2. Push commits + new tag
git push origin main --follow-tags

# 3. GitLab CI publish job triggers automatically on v* tag
# Monitor at: https://git.caerux.com/caeruxlab/clx-ai-kit/-/pipelines
```

## Integration Points

| Integration | Protocol | Auth | Notes |
|------------|----------|------|-------|
| GitLab Package Registry (publish) | HTTPS + npm protocol | CI Job Token (`$CI_JOB_TOKEN`) | Project-level; automatic in CI |
| GitLab Package Registry (install) | HTTPS + npm protocol | GitLab PAT (`read_package_registry`) | Consumer configures `~/.npmrc` |

## Error Handling

| Error | Cause | Resolution |
|-------|-------|-----------|
| `403 Forbidden` on publish | CI Job Token lacks write access | Enable "CI Job Token can access project packages" in GitLab project settings → Settings → CI/CD → Token Access |
| `401 Unauthorized` on install | Token missing or wrong scope | Re-generate GitLab PAT with `read_package_registry` scope; update `~/.npmrc` |
| `409 Conflict` on publish | Version already exists in registry | Bump version in `package.json` before tagging |
| Pipeline fails on `test` stage | Type errors or failing tests | Fix locally: `npm run lint && npm test` |

## Performance Considerations

- No runtime performance concerns (local CLI tool)
- CI pipeline should complete in < 3 minutes (npm ci cached on second run)
- Package size target: < 5MB (validate with `npm pack --dry-run`)

## Security Notes

- **No tokens in the repository**: `.npmrc` uses only `${CI_JOB_TOKEN}` (injected by GitLab) and `${CI_PROJECT_ID}` (a non-secret project identifier)
- **Private package**: `@caeruxlab/aidk` requires authentication to install; unauthenticated requests return 401
- **Scope of CI Job Token**: Automatically scoped to the project's own Package Registry — no lateral movement risk
- **PAT rotation**: GitLab PATs should be rotated periodically; document expiry date in project Wiki or team notes
- **`npm audit`**: Run before each release to catch dependency vulnerabilities

## Migration Notes

This feature does **not** involve database migrations or data backfills. It is a configuration-only migration.

**One-time actions required:**

1. Create GitLab project (manual, in GitLab UI)
2. Push git history to new remote (one-time `git push`)
3. Publish `v0.2.0` as the first GitLab release (establishes package in registry)
4. Update any downstream projects' `.npmrc` to point to the new registry and use the new `@caeruxlab` scope

The old `@anhvt2280/aidk` package on GitHub Packages remains in place but will no longer receive updates after this migration.
