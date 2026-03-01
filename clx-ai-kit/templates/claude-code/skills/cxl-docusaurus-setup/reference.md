# Docusaurus Setup - Detailed Reference

This file contains detailed reference material for Docusaurus setup and configuration. For quick start workflows, see [SKILL.md](SKILL.md).

## Complete Configuration Examples

### TypeScript Configuration (`docusaurus.config.ts`)

```typescript
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  url: 'https://your-site.com',
  baseUrl: '/',

  organizationName: 'your-org',
  projectName: 'your-project',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/your-org/your-repo/tree/main/',
        },
        blog: false, // Disable blog feature
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

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

  themeConfig: {
    navbar: {
      title: 'My Site',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc.`,
    },
  },
};

export default config;
```

### JavaScript Configuration (`docusaurus.config.js`)

If not using TypeScript:

```javascript
// docusaurus.config.js
module.exports = {
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
  // ...
};
```

## Local Search Configuration Details

### Installation

```bash
npm install --save @easyops-cn/docusaurus-search-local
```

### Configuration Options

```typescript
plugins: [
  [
    require.resolve("@easyops-cn/docusaurus-search-local"),
    {
      // Use hashed filenames for better caching
      hashed: true,
      
      // Languages to index (must match i18n.locales)
      language: ["vi", "en", "ja"],
      
      // Highlight search terms on target page
      highlightSearchTermsOnTargetPage: true,
      
      // Explicit search result path
      explicitSearchResultPath: true,
      
      // Optional: Custom index settings
      indexBlog: false, // If blog is disabled
      indexPages: false, // Index pages or not
    },
  ],
],
```

### Verification Steps

1. Start dev server: `npm start`
2. Check that search icon appears in navbar
3. Test search functionality in all locales (vi, en, ja)
4. Verify search results are accurate and properly localized
5. Test search highlighting on result pages

**Important Notes:**
- Local Search indexes content at build time, so rebuild after adding new documentation
- The `hashed: true` option improves performance by using hashed filenames
- Ensure `language` array matches your `i18n.locales` configuration
- Search works across all configured locales automatically

## Manual Workflows

### Creating a New Document (Manual)

1. Navigate to the `docs/` directory
2. Create a markdown file (e.g., `my-new-doc.md`)
3. Add front matter:
   ```markdown
   ---
   sidebar_position: 1
   id: unique-doc-id
   title: Tiêu đề tài liệu (Vietnamese)
   description: Mô tả ngắn gọn về tài liệu này bằng tiếng Việt.
   ---
   ```
4. Add content following templates in [templates.md](templates.md)

### Translation Workflow (Manual)

To manually translate documents:

1. **Run the write-translations command** (for UI strings):
   ```bash
   npm run write-translations -- --locale en
   npm run write-translations -- --locale ja
   ```

2. **Copy docs for translation**:
   Copy files from `docs/` to the respective `i18n` folders:
   - English: `i18n/en/docusaurus-plugin-content-docs/current/`
   - Japanese: `i18n/ja/docusaurus-plugin-content-docs/current/`

3. **Translate Content**:
   Translate the `title`, `description`, and content body. **Keep the `id` the same** to link translations.

### Automated Translation Script Pattern

For AI agents or automation:

```bash
# 1. Ensure i18n directories exist
mkdir -p i18n/en/docusaurus-plugin-content-docs/current
mkdir -p i18n/ja/docusaurus-plugin-content-docs/current

# 2. Copy file structure (maintain directory structure)
cp -r docs/* i18n/en/docusaurus-plugin-content-docs/current/
cp -r docs/* i18n/ja/docusaurus-plugin-content-docs/current/

# 3. Then translate each file's content
```

**Important**: After copying, translate the content while preserving:
- File names
- Directory structure
- Front matter `id` and `sidebar_position`
- Code blocks (translate comments only)
- Markdown syntax

## Advanced Patterns

### Custom Sidebar Configuration

Create `sidebars.ts`:

```typescript
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started/installation', 'getting-started/configuration'],
    },
  ],
};

export default sidebars;
```

### Custom Styling

Add custom CSS in `src/css/custom.css`:

```css
:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  --ifm-color-primary-darker: #277148;
  --ifm-color-primary-darkest: #205d3b;
  --ifm-color-primary-light: #33925d;
  --ifm-color-primary-lighter: #359962;
  --ifm-color-primary-lightest: #3cad6e;
}
```

### Environment-Specific Configuration

Use environment variables:

```typescript
const config: Config = {
  url: process.env.SITE_URL || 'https://your-site.com',
  baseUrl: process.env.BASE_URL || '/',
  // ...
};
```

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
3. Set environment variables if needed
4. Deploy automatically on push

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Set environment variables if needed
4. Deploy automatically on push

### GitHub Pages Deployment

1. Configure `docusaurus.config.ts`:
   ```typescript
   const config: Config = {
     url: 'https://your-username.github.io',
     baseUrl: '/your-repo-name/',
     organizationName: 'your-username',
     projectName: 'your-repo-name',
     // ...
   };
   ```

2. Add deployment script to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "docusaurus deploy"
     }
   }
   ```

3. Run deployment:
   ```bash
   npm run deploy
   ```

For full deployment guide, see [Docusaurus Deployment](https://docusaurus.io/docs/deployment).

## Verification & Testing

### Comprehensive Translation Verification

After creating/updating documentation:

1. **Check all locales load correctly:**
   ```bash
   npm start -- --locale vi
   npm start -- --locale en
   npm start -- --locale ja
   ```

2. **Verify language switcher works** - Test switching between languages in the UI

3. **Check for missing translations:**
   - Ensure all files exist in all three locale directories
   - Verify front matter `id` matches across locales
   - Check that content is properly translated (not just copied)
   - Verify file paths match exactly

4. **Validate markdown syntax** in all files:
   - Check for proper YAML front matter
   - Verify no broken markdown syntax
   - Ensure proper heading hierarchy

5. **Test search functionality:**
   - Search in Vietnamese locale
   - Search in English locale
   - Search in Japanese locale
   - Verify results are accurate and localized

6. **Check links:**
   - Internal links work across locales
   - External links are valid
   - Relative paths are correct

### Build Verification

```bash
# Build for production
npm run build

# Test production build locally
npm run serve
```

Check for:
- Build errors or warnings
- Missing translations
- Broken links
- Search index generation

## Error Handling

### Common Build Errors

**Error: Missing translation files**
- Solution: Ensure all files exist in all locale directories
- Check: File paths match exactly across locales

**Error: Invalid front matter**
- Solution: Verify YAML syntax in front matter
- Check: No special characters in `id` fields

**Error: Search index not generated**
- Solution: Rebuild after adding new documentation
- Check: Local Search plugin is properly configured

For more troubleshooting, see [troubleshooting.md](troubleshooting.md).
