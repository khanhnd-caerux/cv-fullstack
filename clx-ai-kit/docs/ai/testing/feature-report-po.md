---
phase: testing
title: "Testing: PA/DA Report Generator"
description: Testing scenarios for the report-po skill and workflow
---

# Testing: PA/DA Report Generator (`report-po`)

> **Status**: ✅ Complete
>
> **Related docs**: [Requirements](../requirements/feature-report-po.md) | [Design](../design/feature-report-po.md) | [Planning](../planning/feature-report-po.md) | [Implementation](../implementation/feature-report-po.md)

## Test Coverage Goals

For AI workflows and skills, testing is primarily manual, scenario-based end-to-end testing, as unit testing is not applicable.

## End-to-End Tests

| Scenario | Flow description | Steps | Expected outcome | Status |
|----------|-----------------|-------|-----------------|--------|
| E2E-1 | Happy Path: Create report from blank | 1. Trigger @[/create-report-po]<br>2. Provide no source URL<br>3. Answer PA DA questions<br>4. Review generated .md<br>5. Confirm publish to Notion | Valid Vietnamese report created in Notion with all sections filled correctly. | [ ] |
| E2E-2 | Context Fetching | 1. Trigger workflow<br>2. Provide valid Notion source URL<br>3. AI should summarize and pre-fill some PA questions<br>4. Complete workflow | AI correctly extracts What/Where/When from the source page. | [ ] |
| E2E-3 | Review Edit | 1. Trigger workflow and generate report<br>2. During review step, ask AI to "change the severity to High and add a new option to DA"<br>3. Confirm publish | The generated Notion page reflects the requested edits. | [ ] |
| E2E-4 | Fallback (No Notion) | 1. Trigger workflow<br>2. When asked for destination, provide invalid URL/ID or simulate MCP failure | AI provides the local .md file and explains that Notion publishing failed. | [ ] |

## Manual Testing

- [ ] Verify template formatting (tables render correctly in Notion)
- [ ] Verify AI asks questions one at a time (does not bulk ask)
- [ ] Verify AI uses Vietnamese consistently throughout the entire workflow

## File Validation
- [x] Check `.agent/skills/cxl-report-po/SKILL.md` exists and is actionable
- [x] Check `.agent/skills/cxl-report-po/templates/report-template.md` exists
- [x] Check `.agent/workflows/create-report-po.md` exists
