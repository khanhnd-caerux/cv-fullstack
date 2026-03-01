# Docusaurus Troubleshooting Guide

This file contains troubleshooting information for common Docusaurus setup and documentation issues. For workflow guidance, see [SKILL.md](SKILL.md).

## Missing Translations

### Symptom
A page doesn't appear in a specific locale, or shows fallback content.

### Diagnosis Steps

1. **Check file exists in correct path:**
   ```bash
   # Verify file exists in all locales
   ls i18n/en/docusaurus-plugin-content-docs/current/your-file.md
   ls i18n/ja/docusaurus-plugin-content-docs/current/your-file.md
   ```

2. **Verify `id` matches across all locales:**
   ```bash
   # Check front matter IDs match
   grep "^id:" docs/your-file.md
   grep "^id:" i18n/en/docusaurus-plugin-content-docs/current/your-file.md
   grep "^id:" i18n/ja/docusaurus-plugin-content-docs/current/your-file.md
   ```

3. **Check file naming matches exactly:**
   - File names must be identical across locales
   - Case-sensitive matching
   - No extra spaces or special characters

4. **Verify directory structure:**
   ```
   docs/
     └── your-file.md
   i18n/
     ├── en/
     │   └── docusaurus-plugin-content-docs/
     │       └── current/
     │           └── your-file.md
     └── ja/
         └── docusaurus-plugin-content-docs/
             └── current/
                 └── your-file.md
   ```

### Solutions

1. **File missing:** Create the file in the correct locale directory
2. **ID mismatch:** Update front matter `id` to match across all locales
3. **File name mismatch:** Rename files to match exactly
4. **Directory structure wrong:** Recreate correct directory structure
5. **Restart dev server:** `npm start` (sometimes needed after file changes)

## Language Switcher Not Working

### Symptom
Language switcher doesn't appear or doesn't switch languages correctly.

### Diagnosis Steps

1. **Verify i18n config in `docusaurus.config.ts`:**
   ```typescript
   i18n: {
     defaultLocale: 'vi',
     locales: ['vi', 'en', 'ja'],
     localeConfigs: {
       vi: { label: 'Tiếng Việt' },
       en: { label: 'English' },
       ja: { label: '日本語' },
     },
   },
   ```

2. **Check navbar configuration:**
   ```typescript
   navbar: {
     items: [
       {
         type: 'localeDropdown',
         position: 'right',
       },
     ],
   },
   ```

3. **Verify UI strings are translated:**
   ```bash
   npm run write-translations -- --locale en
   npm run write-translations -- --locale ja
   ```

### Solutions

1. **Config incorrect:** Fix `i18n` configuration in `docusaurus.config.ts`
2. **Missing localeDropdown:** Add locale dropdown to navbar items
3. **UI strings missing:** Run `write-translations` command
4. **Restart dev server:** `npm start`

## Build Errors

### Symptom
Build fails with errors during `npm run build`.

### Common Errors

#### Error: Invalid Front Matter

**Symptom:**
```
Error: Invalid front matter in file: docs/example.md
```

**Solution:**
1. Check YAML syntax in front matter
2. Ensure proper indentation
3. Verify no special characters in `id` field
4. Check for unclosed quotes or brackets

**Example fix:**
```markdown
---
id: example  # ✅ Good
title: Example
---

---
id: example with spaces  # ❌ Bad - spaces in id
title: Example
---
```

#### Error: Missing Required Fields

**Symptom:**
```
Error: Missing required field 'id' in docs/example.md
```

**Solution:**
1. Add required front matter fields: `id`, `title`
2. Ensure all locale files have matching front matter

#### Error: Markdown Syntax Errors

**Symptom:**
```
Error: Markdown parsing error in docs/example.md
```

**Solution:**
1. Check for unclosed code blocks
2. Verify proper heading hierarchy
3. Check for invalid markdown syntax
4. Validate with markdown linter

#### Error: Broken Links

**Symptom:**
```
Error: Broken link to './non-existent.md' in docs/example.md
```

**Solution:**
1. Verify link paths are correct
2. Check file exists in all locales
3. Use relative paths: `./file.md` not `/file.md`
4. Update or remove broken links

### Build Verification

```bash
# Build and check for errors
npm run build

# If build succeeds, test locally
npm run serve
```

## Search Not Working

### Symptom
Search icon doesn't appear or search returns no results.

### Diagnosis Steps

1. **Verify Local Search plugin is installed:**
   ```bash
   npm list @easyops-cn/docusaurus-search-local
   ```

2. **Check plugin configuration:**
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

3. **Verify language array matches i18n locales:**
   - `language` in plugin config must match `locales` in i18n config

4. **Check search index is generated:**
   - Search index is generated at build time
   - Rebuild after adding new documentation

### Solutions

1. **Plugin not installed:** `npm install --save @easyops-cn/docusaurus-search-local`
2. **Config incorrect:** Fix plugin configuration in `docusaurus.config.ts`
3. **Language mismatch:** Ensure `language` array matches `i18n.locales`
4. **Index not generated:** Rebuild: `npm run build`
5. **Restart dev server:** `npm start`

## Content Not Updating

### Symptom
Changes to documentation don't appear in dev server.

### Solutions

1. **Clear cache and restart:**
   ```bash
   rm -rf .docusaurus
   npm start
   ```

2. **Check file is saved:** Verify file changes are saved

3. **Verify correct file:** Ensure editing correct locale file

4. **Check browser cache:** Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

## Performance Issues

### Symptom
Slow build times or slow site performance.

### Solutions

1. **Optimize images:** Use optimized image formats (WebP)
2. **Reduce bundle size:** Remove unused dependencies
3. **Enable hashing:** Use `hashed: true` in Local Search config
4. **Check build output:** Review build logs for warnings

## Common Configuration Issues

### TypeScript Configuration Errors

**Symptom:** Type errors in `docusaurus.config.ts`

**Solution:**
```typescript
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  // ... config
} satisfies Config;

export default config;
```

### Sidebar Configuration Errors

**Symptom:** Sidebar not displaying correctly

**Solution:**
1. Verify `sidebars.ts` syntax
2. Check file IDs match sidebar references
3. Ensure all referenced files exist

### Theme Configuration Errors

**Symptom:** Custom theme not applying

**Solution:**
1. Verify `src/css/custom.css` exists
2. Check CSS variables are correct
3. Clear cache and rebuild

## Debugging Tips

### Enable Verbose Logging

```bash
DEBUG=* npm start
```

### Check Generated Files

```bash
# View generated build output
ls -la build/

# Check search index
ls -la build/search-index.json
```

### Validate Configuration

```bash
# Check config syntax
npx docusaurus clear
npm run build
```

## Getting Help

If issues persist:

1. Check [Docusaurus documentation](https://docusaurus.io/docs)
2. Review [Docusaurus GitHub issues](https://github.com/facebook/docusaurus/issues)
3. Check project-specific documentation
4. Review error messages carefully for specific guidance

## Prevention Checklist

To avoid common issues:

- [ ] Always create files in all three locales
- [ ] Keep `id` values identical across locales
- [ ] Use consistent file naming (lowercase, hyphens)
- [ ] Validate front matter syntax
- [ ] Test all locales after changes
- [ ] Rebuild after adding new documentation
- [ ] Keep configuration files synchronized
- [ ] Document project-specific patterns
