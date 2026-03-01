---
description: Update existing feature documentation from new requirements through planning.
---

Guide me through update a feature, from requirements documentation to implementation readiness.

1. **Capture Requirement** — If not already provided, ask for: feature name (kebab-case, e.g., `user-authentication`), what problem it solves and who will use it, and key user stories.
2. **Review existing feature** - feature-specific files:
   - `docs/ai/requirements/README.md` → `docs/ai/requirements/feature-{name}.md`
   - `docs/ai/design/README.md` → `docs/ai/design/feature-{name}.md`
   - `docs/ai/planning/README.md` → `docs/ai/planning/feature-{name}.md`
   - `docs/ai/implementation/README.md` → `docs/ai/implementation/feature-{name}.md`
   - `docs/ai/testing/README.md` → `docs/ai/testing/feature-{name}.md`
3. **Update new requirements to existing feature** - feature-specific files:
   - `docs/ai/requirements/README.md` → `docs/ai/requirements/feature-{name}.md`
   - `docs/ai/design/README.md` → `docs/ai/design/feature-{name}.md`
   - `docs/ai/planning/README.md` → `docs/ai/planning/feature-{name}.md`
   - `docs/ai/implementation/README.md` → `docs/ai/implementation/feature-{name}.md`
   - `docs/ai/testing/README.md` → `docs/ai/testing/feature-{name}.md`
4. **Documentation Review** — Run `/review-requirements` and `/review-design` to validate the drafted docs.
5. **Next Steps** — This command focuses on documentation. When ready to implement, use `/execute-plan`. Generate a PR description covering: summary, requirements doc link, key changes, test status, and a readiness checklist.