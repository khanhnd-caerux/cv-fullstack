---
phase: testing
title: Testing Strategy - Project Documentation
description: Define testing approach to ensure documentation quality and site availability.
---

# Testing Strategy

**Related docs**: [Requirements](../requirements/feature-project-documentation.md) | [Design](../design/feature-project-documentation.md) | [Planning](../planning/feature-project-documentation.md) | [Implementation](../implementation/feature-project-documentation.md)

## Test Coverage Goals

| Test level | Scope | Target |
|-----------|-------|----------------|
| End-to-end Build | `npm run build` | 100% success rate without warnings or broken links. |
| Locales checking | Development server | Verify all 3 locales start properly. |

## Build Validation
Docusaurus strictly checks for broken links at build time.
Run `npm run build` inside the `website` folder.
* **Criteria:** The build must succeed without throwing `Broken links found!` errors.

## Manual Testing
Since it is a documentation site, most quality assurance is manual validation.

### UI/UX & Formatting
- [ ] Verify that markdown headers, code blocks, lists, and tables render correctly in Vietnamese.
- [ ] Verify the exact same formatting applies to the English translation.
- [ ] Verify the exact same formatting applies to the Japanese translation.

### Functionality
- [ ] Test the language switcher dropdown in the navbar. Ensure switching from an English page stays on the same page when switching to Japanese or Vietnamese.
- [ ] Use the search bar in `vi` locale. Check if results point to `/docs/...`
- [ ] Use the search bar in `en` locale. Check if results point to `/en/docs/...`
- [ ] Use the search bar in `ja` locale. Check if results point to `/ja/docs/...`

### GitLab Deployment Verification
- [ ] Check the GitLab Pipelines tab after pushing to ensure the `pages` job succeeds.
- [ ] Navigate to the GitLab Pages public URL and verify the live site matches the local build.
