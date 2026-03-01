---
name: cxl-docusaurus-setup
description: >
  Set up Docusaurus documentation projects with i18n support (Vietnamese, English, Japanese), create and update documentation following Vietnamese-first workflow, translate content across all locales. Use when setting up documentation sites, creating new docs, updating existing documentation, translating content, or working with Docusaurus i18n configuration.
---

# Docusaurus Project Setup & Documentation Guide

## Purpose

This skill provides a standardized workflow for creating and managing documentation sites using [Docusaurus](https://docusaurus.io/). It focuses on setting up a new project with Internationalization (i18n) support for **Vietnamese (primary)**, **English**, and **Japanese**.

**For AI Agents**: When creating or updating documentation, you MUST:
1. Generate content in Vietnamese first (primary locale)
2. Automatically translate to English and Japanese
3. Maintain consistent structure and IDs across all locales
4. Ensure technical accuracy and completeness in all languages

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager

## Quick Start

### 1. Initialize Project

```bash
npx create-docusaurus@latest <site-name> classic --typescript
```

Ask user about `<site-name>` before running.

### 2. Configure i18n

Open `docusaurus.config.ts` and configure:

```typescript
// docusaurus.config.ts
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  // ... other config
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en', 'ja'],
    localeConfigs: {
      vi: {
        label: 'Tiếng Việt',
      },
      en: {
        label: 'English',
      },
      ja: {
        label: '日本語',
      },
    },
  },
  // ...
};

export default config;
```

### 3. Install Local Search Plugin

**REQUIRED**: Configure Local Search plugin for client-side search functionality.

```bash
npm install --save @easyops-cn/docusaurus-search-local
```

Add to `docusaurus.config.ts`:

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

For complete configuration details, see [reference.md](reference.md).

## Documentation Structure

```
my-website/
├── docs/                   # Default locale (Vietnamese) documents
│   ├── intro.md
│   └── how-to-use-docusaurus/
│       ├── create-a-document.md
│       └── ...
├── i18n/
│   ├── en/                 # English translations
│   │   └── docusaurus-plugin-content-docs/
│   │       └── current/
│   │           └── intro.md
│   └── ja/                 # Japanese translations
│       └── docusaurus-plugin-content-docs/
│           └── current/
│               └── intro.md
├── src/
├── static/
└── docusaurus.config.ts
```

## AI Agent Workflows

### Creating New Documentation

**Step 1: Create Vietnamese Document (Primary)**
1. Create document in `docs/` directory
2. Use template from [templates.md](templates.md)
3. Ensure content is complete and technically accurate

**Step 2: Generate Translation Files**
1. Ensure i18n directories exist:
   ```bash
   mkdir -p i18n/en/docusaurus-plugin-content-docs/current
   mkdir -p i18n/ja/docusaurus-plugin-content-docs/current
   ```

2. Copy file structure maintaining directory structure:
   ```bash
   cp -r docs/<new-file> i18n/en/docusaurus-plugin-content-docs/current/
   cp -r docs/<new-file> i18n/ja/docusaurus-plugin-content-docs/current/
   ```

**Step 3: Translate Content**
For each translation file:
- Translate front matter `title` and `description`
- Translate all markdown content (headers, paragraphs, code comments)
- Keep `id` and `sidebar_position` identical across all locales
- Preserve code blocks exactly (translate comments only)

**Translation Guidelines:**
- **English**: Clear, professional technical English. Maintain technical accuracy.
- **Japanese**: Appropriate technical Japanese (技術文書). Use formal language suitable for documentation.

**Step 4: Verify Structure**
Ensure all three files have:
- Same `id` value
- Same `sidebar_position` value
- Same file path structure
- Translated but equivalent content

### Updating Existing Documentation

1. **Update Vietnamese version first** in `docs/`
2. **Update corresponding English file** in `i18n/en/docusaurus-plugin-content-docs/current/`
3. **Update corresponding Japanese file** in `i18n/ja/docusaurus-plugin-content-docs/current/`
4. Maintain consistency: if you add a section in Vietnamese, add it in all languages

### File Naming Convention

- Use lowercase with hyphens: `my-document.md`
- Keep filenames identical across all locales
- Use descriptive names that reflect content
- Avoid special characters except hyphens

Example:
- `docs/getting-started.md` (Vietnamese)
- `i18n/en/docusaurus-plugin-content-docs/current/getting-started.md` (English)
- `i18n/ja/docusaurus-plugin-content-docs/current/getting-started.md` (Japanese)

## Content Quality Standards

All generated documentation must meet:

**Completeness:**
- Cover all aspects of the topic
- Include prerequisites if needed
- Provide examples when applicable
- Include troubleshooting tips for common issues

**Accuracy:**
- Verify all technical information
- Ensure code examples are correct and tested
- Keep information up-to-date with the project
- Cross-reference related documentation

**Clarity:**
- Use clear, concise language
- Structure content logically
- Use appropriate headings hierarchy
- Include visual aids (code blocks, diagrams) when helpful

**Consistency:**
- Follow the same structure across all languages
- Use consistent terminology
- Maintain the same level of detail in all locales
- Keep formatting consistent

## Development & Testing

### Start Dev Server

Default locale (Vietnamese):
```bash
npm start
```

Specific locale:
```bash
npm start -- --locale en
npm start -- --locale ja
```

### Verify Translations

1. Check all locales load correctly
2. Verify language switcher works
3. Check for missing translations (files exist, IDs match)
4. Validate markdown syntax in all files

For detailed verification steps, see [reference.md](reference.md).

## Quick Reference Checklist

**Initial Setup:**
- [ ] Docusaurus project initialized
- [ ] i18n configured for vi, en, ja
- [ ] Default locale set to Vietnamese (vi)
- [ ] Language switcher verified in UI
- [ ] Local Search plugin installed and configured
- [ ] Local Search tested in all locales

**For Each New Document:**
- [ ] Vietnamese version created in `docs/`
- [ ] English translation created in `i18n/en/docusaurus-plugin-content-docs/current/`
- [ ] Japanese translation created in `i18n/ja/docusaurus-plugin-content-docs/current/`
- [ ] All files have matching `id` in front matter
- [ ] All files have matching `sidebar_position`
- [ ] Content is complete and accurate in all languages
- [ ] Code examples work correctly
- [ ] Links and references are correct
- [ ] Tested in dev server for all locales

**Quality Checks:**
- [ ] Technical accuracy verified
- [ ] Examples tested
- [ ] No broken links
- [ ] Consistent formatting
- [ ] Proper markdown syntax

## Additional Resources

- **Templates & Examples**: See [templates.md](templates.md) for complete document templates and translation examples
- **Detailed Reference**: See [reference.md](reference.md) for complete configuration, advanced patterns, and manual workflows
- **Troubleshooting**: See [troubleshooting.md](troubleshooting.md) for common issues and solutions
- **Deployment**: See [reference.md](reference.md#deployment) for deployment instructions

## Common Patterns

### Code Block Translation

Keep code blocks identical, only translate comments:

```javascript
// Vietnamese: Khởi tạo ứng dụng
// English: Initialize application
// Japanese: アプリケーションを初期化
const app = initialize();
```

### Link Translation

Keep internal links functional:
- Use relative paths: `./other-doc.md`
- Keep file paths identical across locales
- Only translate link text, not the path

### Terminology Consistency

Maintain consistent technical terms:
- Create a glossary if needed
- Use the same English technical terms in Vietnamese/Japanese when appropriate
- Document project-specific terminology

For more patterns and examples, see [templates.md](templates.md) and [reference.md](reference.md).
