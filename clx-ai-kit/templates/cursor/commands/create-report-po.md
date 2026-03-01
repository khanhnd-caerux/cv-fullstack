---
description: Create a PA/DA report from Notion context and publish to Notion.
---

Guide me through creating a structured Problem Analysis (PA) and Decision Analysis (DA) report.

1. **Read skill** — Read `.agent/skills/cxl-report-po/SKILL.md` completely to understand the PA/DA framework, question flow, and report generation rules.
2. **Ask for source Notion page** — Ask the user for the Notion page URL or ID that contains the context for the report (bug report, incident, feature request, meeting notes, etc.).
3. **Fetch Notion context** — Use `notion-fetch` to retrieve the content of the source page. Summarize the key information found.
   - If fetch fails (404, permission error), inform the user and ask for a corrected URL or suggest proceeding without context.
4. **Collect report metadata** — Ask the user for:
   - Tên người báo cáo (reporter name)
   - Tên dự án / hệ thống (project name)
5. **Conduct PA questions** — Ask one question at a time, following the PA framework. Use the fetched Notion content to suggest answers where possible:
   - **What**: Vấn đề đang xảy ra là gì?
   - **Where**: Vấn đề phát sinh ở đâu?
   - **When**: Vấn đề được phát hiện khi nào?
   - **Extent**: Mức độ ảnh hưởng ra sao?
   - **Root cause**: Nguyên nhân gốc rễ là gì?
6. **Conduct DA questions** — Ask one question at a time:
   - Danh sách các phương án khả thi?
   - Với mỗi phương án: chi phí, thời gian, mức độ cần thiết, rủi ro, lợi ích?
   - Phương án nào được đề xuất? Vì sao?
7. **Generate local report** — Copy the template from `.agent/skills/cxl-report-po/templates/report-template.md` and fill in all sections with the collected information. Save the file as `report-pa-da-{YYYY-MM-DD}-{short-title}.md` in the current directory. If the template file is unavailable, use the section structure from the SKILL.md framework as a guide.
8. **User review** — Present the generated `.md` file to the user. Ask: "Bạn đã hài lòng với nội dung báo cáo chưa? Cần chỉnh sửa gì không?" If changes are requested, update the file and present again.
9. **Ask for Notion destination** — Once the user confirms the report, ask: "Bạn muốn tạo báo cáo ở đâu trên Notion? (URL hoặc page ID)"
10. **Fetch destination** — Use `notion-fetch` on the destination to verify it exists and the user has access. If fetch fails, inform the user and ask for a corrected URL.
11. **Publish to Notion** — First, use `Enhanced Markdown Specification` to understand Notion Markdown formatting. Then use `notion-create-pages` to create a new page under the destination with:
    - `parent.page_id`: the destination page ID
    - `properties.title`: the report title (e.g., "📋 Báo cáo PA/DA - {short-title}")
    - `content`: the full report content in Notion Markdown format
12. **Confirm** — Share the Notion page URL with the user and confirm the report has been created successfully.