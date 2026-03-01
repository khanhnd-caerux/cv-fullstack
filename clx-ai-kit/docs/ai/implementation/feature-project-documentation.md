---
phase: implementation
title: Implementation Guide - Project Documentation
description: Technical implementation notes, patterns, and guidelines for Docusaurus
---

# Implementation Guide

**Related docs**: [Requirements](../requirements/feature-project-documentation.md) | [Design](../design/feature-project-documentation.md) | [Planning](../planning/feature-project-documentation.md) | [Testing](../testing/feature-project-documentation.md)
**Applicable rules/skills**: `cxl-docusaurus-setup`

## Development Setup

```bash
# Inside the root folder
npm create docusaurus@latest website classic --typescript
cd website
npm install
npm install --save @easyops-cn/docusaurus-search-local
```

### Running the server locally
```bash
# Run default language (vi)
npm start

# Run english
npm start -- --locale en

# Run japanese
npm start -- --locale ja
```

## Docusaurus Configuration
Changes required in `website/docusaurus.config.ts`:

1. **i18n Settings**:
```typescript
i18n: {
  defaultLocale: 'vi',
  locales: ['vi', 'en', 'ja'],
  localeConfigs: {
    vi: { label: 'Tiếng Việt' },
    en: { label: 'English' },
    ja: { label: '日本語' },
  },
}
```

2. **Search Plugin**:
```typescript
plugins: [
  [
    require.resolve("@easyops-cn/docusaurus-search-local"),
    {
      hashed: true,
      language: ["vi", "en", "ja"],
      highlightSearchTermsOnTargetPage: true,
      explicitSearchResultPath: true,
    },
  ],
],
```

3. **Navbar Locales**:
Add `'localeDropdown'` to `themeConfig.navbar.items` to allow explicit switching.

## Documentation Structure
The documentation structure follows the `cxl-docusaurus-setup` skill strictly:

- All original source documents go in `website/docs/`.
- Translated `en` documents go in `website/i18n/en/docusaurus-plugin-content-docs/current/`.
- Translated `ja` documents go in `website/i18n/ja/docusaurus-plugin-content-docs/current/`.
- **CRITICAL:** `id` field and `sidebar_position` in the frontmatter MUST be identical across all three translated files.

## GitLab CI Integration
Create or update `.gitlab-ci.yml` in the root:

```yaml
pages:
  stage: deploy
  image: node:24
  script:
    - cd website
    - npm ci
    - npm run build
    - mv build ../public
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```
*(Adjust the branch rule according to the repository's default branch).*
