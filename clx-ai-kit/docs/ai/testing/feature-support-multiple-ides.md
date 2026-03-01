---
phase: testing
title: Testing Strategy - Support Multiple IDEs
description: Testing approach to ensure configurations don't overwrite
---

# Testing Strategy

**Related docs**: [Requirements](../requirements/feature-support-multiple-ides.md) | [Design](../design/feature-support-multiple-ides.md) | [Planning](../planning/feature-support-multiple-ides.md) | [Implementation](../implementation/feature-support-multiple-ides.md)

## Testing Approach
Manual testing via the CLI for backwards compatibility and exact behavior matching.

## Test Cases

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| TC-01 | Fresh initialization | 1. Remove `.ai-devkit.json`<br>2. Run `aidk init`<br>3. Pick 'cursour' | `environments` array has only `['cursor']` | ✅ Pass |
| TC-02 | Add IDE over existing | 1. Ensure `.ai-devkit.json` has `['cursor']`<br>2. Run `aidk init -f`<br>3. Pick 'claude-code' | `environments` array merges to `['cursor', 'claude-code']` | ✅ Pass |
| TC-03 | Pick duplicate | 1. Ensure `['cursor']` is set.<br>2. Pick 'cursor' and 'claude-code' | `environments` merges to `['cursor', 'claude-code']` | ✅ Pass |

## Bug Reports (If any)
None during development.
