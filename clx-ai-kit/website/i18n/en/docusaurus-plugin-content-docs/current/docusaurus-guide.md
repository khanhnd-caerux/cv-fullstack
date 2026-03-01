---
sidebar_position: 9
id: docusaurus-guide
---

# Project Documentation Guide

AIDK's documentation is built using [Docusaurus v3](https://docusaurus.io/). This guide helps Contributors set up their environment, create new pages, and manage internationalization (i18n) translations for the documentation website.

## 1. Local Development Setup

All source code for the documentation website is located in the `website/` directory.

```bash
cd website
npm install
```

### Running the Development Server

Docusaurus supports live reloading. You can run individual languages to test:

```bash
# Run Vietnamese (default locale) at http://localhost:3000
npm start

# Run English at http://localhost:3000/en/
npm start -- --locale en

# Run Japanese at http://localhost:3000/ja/
npm start -- --locale ja
```

## 2. Adding a New Page

Vietnamese is the default language (source of truth) for the project. All new pages must first be drafted in Vietnamese.

1. Create a new Markdown (`.md`) file inside the `website/docs/` directory.
2. An **Id and Position Frontmatter** block is absolutely required at the top of the file:

```markdown
---
sidebar_position: 10
id: my-new-guide
---

# Title of the Document
Document content begins here.
```

## 3. Managing Translations (i18n)

Once the Vietnamese source document is finalized, English and Japanese translations must be provided.

### Copying the Directory Structure

Translated Markdown contents are stored in `website/i18n/{locale}/docusaurus-plugin-content-docs/current/`.

```bash
# Assuming you just created a new guide, copy it to the translation folders
cp website/docs/my-new-guide.md website/i18n/en/docusaurus-plugin-content-docs/current/
cp website/docs/my-new-guide.md website/i18n/ja/docusaurus-plugin-content-docs/current/
```

**Critical Note**: The frontmatter (`sidebar_position` and `id`) in the translated files **must remain exactly the same** as the Vietnamese source. You should only translate the content below the frontmatter block.

### Updating Sidebar and Navbar Labels

If you add a dropdown menu or rename a category in the Sidebar (`sidebars.ts`), you need to provide translations for those labels. Instead of guessing translation keys, use this automated command:

```bash
cd website
npm run docusaurus write-translations -- --locale en
npm run docusaurus write-translations -- --locale ja
```

This command parses the configuration files and outputs the required JSON key scaffold into the `i18n/{locale}/` directories. Open `current.json` (for sidebars) and `navbar.json` to translate the `message` properties.

## 4. Building and CI/CD

Before pushing code to the `main` branch, run a local production build to check for broken links. Docusaurus is extremely strict with broken links.

```bash
npm run build
```

If the command reports `[SUCCESS] Generated static files`, it is safe to commit. When pushing to `main`, the GitLab CI/CD system (`pages` job) will automatically take the `build/` output and deploy it to the project's GitLab Pages URL.
