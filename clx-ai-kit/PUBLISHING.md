# Publishing Guide

How to test, version, and publish `@caeruxlab/aidk` to the GitLab Package Registry.

---

## Prerequisites (One-Time Setup)

Do this once before your very first release.

### 1. Generate a GitLab Personal Access Token

Go to: `https://git.caerux.com/-/user_settings/personal_access_tokens`

**Required scopes:**
- `read_package_registry`
- `write_package_registry`
- `write_repository` (optional — needed to push via HTTPS)

### 2. Configure `~/.npmrc` on your local machine

Add the following to your global `~/.npmrc` (never commit this):

```ini
# Config for @caeruxlab scope
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/
//git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/:_authToken=YOUR_GITLAB_TOKEN
```

Verify it looks correct:

```bash
cat ~/.npmrc
# @caeruxlab:registry=https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/
# //git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/:_authToken=glpat-xxxxxxxxxxxxxxxxxxxx
```

> **Warning**: Never commit your token to the repository. The project-level `.npmrc` is configured to use environment variables `${CI_JOB_TOKEN}` which are automatically injected in GitLab CI.

---

## Local Testing (Before Publishing)

Always test locally before pushing.

### Option A — `npm link` (development loop)

```bash
npm run build
npm link

# Test in a fresh directory
mkdir /tmp/test-project && cd /tmp/test-project
aidk --version
aidk init
aidk list

# Cleanup
npm unlink -g @caeruxlab/aidk
```

After `npm link`, each `npm run build` updates the command instantly — no re-linking needed.

### Option B — `npm pack` (simulate exact publish)

```bash
npm run build
npm pack
# Creates: caeruxlab-aidk-0.2.0.tgz

mkdir /tmp/test-project && cd /tmp/test-project
npm install /path/to/clx-ai-kit/caeruxlab-aidk-0.2.0.tgz
npx aidk init
```

This installs exactly what users get from the registry.

---

## Release Checklist

Before every release, verify:

- [ ] All tests pass: `npm test`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Tested locally with `npm link` or `npm pack`
- [ ] `package.json` version bumped
- [ ] `CHANGELOG.md` updated with new entries

---

## Versioning

Follow [Semantic Versioning](https://semver.org):

| Change | Version bump | Example |
|--------|-------------|---------|
| Bug fixes | Patch `0.0.x` | `0.1.0` → `0.1.1` |
| New features (backwards compatible) | Minor `0.x.0` | `0.1.0` → `0.2.0` |
| Breaking changes | Major `x.0.0` | `0.1.0` → `1.0.0` |

Bump the version in `package.json`:

```bash
npm version patch   # 0.2.0 → 0.2.1
npm version minor   # 0.2.0 → 0.3.0
npm version major   # 0.2.0 → 1.0.0
```

This automatically updates `package.json` and `package-lock.json`.

---

## Publishing

### Automated (recommended) — via GitLab CI

The `.gitlab-ci.yml` pipeline publishes automatically when you push a tag starting with `v` (e.g., `v0.2.0`).

**Steps:**

1. Bump version and update changelog:
   ```bash
   npm version minor   # or patch / major
   ```

2. Push commits and the new tag:
   ```bash
   git add package.json package-lock.json CHANGELOG.md
   git commit -m "chore: release v0.3.0"
   git tag v0.3.0
   git push origin main --follow-tags
   ```

3. The pipeline runs automatically. Monitor it at:
   ```
   https://git.caerux.com/caeruxlab/clx-ai-kit/-/pipelines
   ```

4. Verify the package was published in the **Package Registry**:
   ```
   https://git.caerux.com/caeruxlab/clx-ai-kit/-/packages
   ```

---

### Manual (for emergencies)

If the pipeline fails and you need to publish manually:

```bash
npm run build
npm publish --userconfig ~/.npmrc
```

Requires `~/.npmrc` configured with your token (see Prerequisites).

---

## Verify Installation After Publishing

```bash
# In a fresh directory
mkdir /tmp/verify && cd /tmp/verify
npm install @caeruxlab/aidk --userconfig ~/.npmrc
npx aidk --version
```

---

## Troubleshooting

**Step Script: npm: command not found**
- Ensure your GitLab Runner has Node.js and npm installed and in its PATH.
- If using NVM, ensure the `.gitlab-ci.yml` `before_script` loads NVM correctly.

**`npm publish` returns 403**
- Your token is missing `write_package_registry` scope.
- In GitLab settings: **Settings → CI/CD → Token Access** → ensure "CI Job Token can access project packages" is enabled.

**`npm install @caeruxlab/aidk` returns 401 / 404**
- `~/.npmrc` is missing the token or registry line.
- Scoped registry URL is wrong (ensure project-level ID or path is correct).
- Token has expired.

**Workflow fails on `npm test`**
- Fix failing tests before releasing. Use `npm test` locally to debug.
