---
id: publishing
title: Publishing
sidebar_position: 7
description: Guide to publishing the AIDK package to the GitLab Package Registry.
---

# Publishing

AIDK is published to the **GitLab Package Registry** instead of the public npm registry. The complete process is described below.

## Prerequisites

1. You must be a project member with `Maintainer` or `Owner` role on the GitLab project.
2. You must have a **Personal Access Token** (PAT) with `api` or `write_registry` scope.
3. The `.npmrc` file must be correctly configured.

## Step 1: Configure `.npmrc`

Create or update `.npmrc` in the project root:

```ini
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/
//git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/:_authToken=${NPM_TOKEN}
```

:::caution
Do not commit real tokens to `.npmrc`. Use the `NPM_TOKEN` environment variable.
:::

## Step 2: Set the Environment Variable

```bash
export NPM_TOKEN=your-personal-access-token
```

## Step 3: Build Before Publishing

```bash
npm run build
```

Verify the build output in the `dist/` directory.

## Step 4: Bump the Version

Use `npm version` to update `package.json` following [Semantic Versioning](https://semver.org):

```bash
# Patch (0.2.0 -> 0.2.1)
npm version patch

# Minor (0.2.0 -> 0.3.0)
npm version minor

# Major (0.2.0 -> 1.0.0)
npm version major
```

## Step 5: Publish

```bash
npm publish
```

The `prepublishOnly` script in `package.json` will automatically run `npm run build` before publishing.

## Automated Publishing via GitLab CI/CD

The manual process above is for exceptional cases. Normally, publishing is done **automatically via GitLab CI/CD** when a new tag is pushed to `main`.

See the **[GitLab Setup](./gitlab-setup.md)** page for details.

## Verify After Publishing

After publishing, confirm the package appears at:
- GitLab UI: **Project → Deploy → Package Registry**
- Or try installing it: `npm install -g @caeruxlab/aidk@<version>`

## Update the CHANGELOG

Always update `CHANGELOG.md` before publishing to document the changes in the new version.
