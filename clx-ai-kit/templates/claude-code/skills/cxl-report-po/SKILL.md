---
name: cxl-report-po
description: >
  Use when a team member needs to write a structured problem analysis (PA)
  and decision analysis (DA) report for their Leader or client.
  Guides the AI through fetching Notion context, asking PA/DA questions,
  generating a local .md report for review, and publishing to Notion.
---

# Báo cáo Phân tích & Đề xuất (PA/DA Report)

## Purpose

Hướng dẫn AI agent tạo báo cáo phân tích vấn đề (Problem Analysis) và đề xuất phương án (Decision Analysis) một cách có cấu trúc, nhất quán.

Skill này giúp:
- Chuẩn hóa cách báo cáo vấn đề cho Leader
- Đảm bảo phân tích đầy đủ các khía cạnh trước khi đề xuất
- Tạo báo cáo chuyên nghiệp trên Notion

---

## Prerequisites

- **Notion MCP** phải được cấu hình và kết nối
- User có quyền truy cập workspace Notion
- Nếu Notion MCP không khả dụng, fallback sang tạo file `.md` locally

---

## The PA/DA Framework

### Phần 1: Phân tích vấn đề (Problem Analysis - PA)

Khi gặp vấn đề phát sinh trong công việc, cần phân tích các yếu tố sau để xác định nguyên nhân gốc rễ:

| Yếu tố | Câu hỏi cần trả lời | Ví dụ |
|---------|---------------------|-------|
| **What** (Xác định vấn đề) | Vấn đề đang xảy ra là gì? Bản chất và tác động? | "API trả về lỗi 500 khi user đăng nhập" |
| **Where** (Vị trí phát sinh) | Nơi xảy ra? Yếu tố nào liên quan? | "Lỗi ở authentication service, do config sai" |
| **When** (Thời gian) | Khi nào phát hiện? Liên tục hay thời điểm cụ thể? | "Sau khi deploy phiên bản 2.1.0 ngày 20/02" |
| **Extent** (Mức độ ảnh hưởng) | Quy mô? Bao nhiêu người bị ảnh hưởng? | "500 user bị ảnh hưởng, chỉ 1 URL duy nhất" |
| **Root Cause** (Nguyên nhân gốc rễ) | Nguyên nhân đã xác định hoặc giả định? | "Config sai sau khi deploy v2.1.0" |

### Phần 2: Đề xuất phương án (Decision Analysis - DA)

Xác định lợi ích, rủi ro, chi phí, thời gian và mức độ ưu tiên của từng phương án:

1. **Xác định các phương án** — Lên danh sách các phương án khả thi
2. **Phân tích từng phương án** theo:
   - Chi phí (trực tiếp và gián tiếp)
   - Thời gian hoàn thành
   - Mức độ cần thiết / ưu tiên
   - Rủi ro và lợi ích
3. **So sánh và xếp hạng** — Phương án có điểm tổng thể cao nhất được ưu tiên

---

## How the AI Should Conduct the Session

### Rules

- **Hỏi từng câu một** — Không hỏi nhiều câu cùng lúc
- **Luôn sử dụng tiếng Việt** — Cả câu hỏi và báo cáo
- **Đưa ví dụ cụ thể** — Giúp user hiểu cần trả lời gì
- **Tận dụng context từ Notion** — Dùng nội dung đã fetch để gợi ý câu trả lời
- **Không bỏ sót yếu tố nào** — Phải hỏi đủ What/Where/When/Extent/Root Cause cho PA
- **Lưu tiến trình** — Nếu user dừng giữa chừng, lưu file `.md` với những gì đã thu thập được, đánh dấu các section chưa hoàn thành bằng `{TODO}`

### Question Flow

#### PA Questions (hỏi theo thứ tự):

1. **What**: "Vấn đề đang xảy ra là gì? Mô tả ngắn gọn bản chất và tác động."
   - Dựa trên Notion page đã fetch, gợi ý nội dung nếu có thể
2. **Where**: "Vấn đề phát sinh ở đâu? (module, server, environment, URL...)"
3. **When**: "Vấn đề được phát hiện khi nào? Liên tục hay tại thời điểm cụ thể?"
4. **Extent**: "Mức độ ảnh hưởng ra sao? Bao nhiêu user/hệ thống bị ảnh hưởng?"
5. **Root cause**: "Nguyên nhân gốc rễ là gì? (nếu chưa xác định, nêu giả định)"

#### DA Questions (hỏi theo thứ tự):

1. "Bạn đã xác định được những phương án nào để xử lý vấn đề này?"
   - Nếu user chưa có, AI gợi ý dựa trên context
2. Với mỗi phương án, hỏi: "Chi phí, thời gian, mức độ cần thiết, rủi ro và lợi ích?"
3. "Bạn đề xuất phương án nào? Vì sao?"

---

## Report Generation Rules

### File Output

- **Template**: Sử dụng `templates/report-template.md` trong thư mục skill này
- **File naming**: `report-pa-da-{YYYY-MM-DD}-{short-title}.md`
  - Ví dụ: `report-pa-da-2026-02-24-loi-500-login.md`
- **Save location**: Tạo file trong thư mục hiện tại hoặc thư mục user chỉ định
- **Encoding**: UTF-8

### Content Rules

- Điền đầy đủ tất cả sections trong template
- Sử dụng emoji cho mức độ nghiêm trọng: 🔴 Cao / 🟡 Trung bình / 🟢 Thấp
- Bảng so sánh phương án phải có ít nhất 2 phương án
- Luôn có phần đề xuất rõ ràng với lý do

### Review Process

1. Tạo file `.md` locally
2. Hiển thị nội dung cho user review
3. **Chờ user xác nhận** trước khi publish lên Notion
4. Nếu user yêu cầu chỉnh sửa, cập nhật file và hiển thị lại

---

## Notion Publishing

### Using Notion MCP

Sau khi user xác nhận nội dung báo cáo:

1. **Hỏi destination**: "Bạn muốn tạo báo cáo ở đâu trên Notion? (URL hoặc page ID)"
2. **Fetch destination page**: Sử dụng `notion-fetch` để xác nhận page tồn tại. Nếu fetch thất bại, thông báo lỗi và hỏi lại URL.
3. **Fetch Notion Markdown spec**: Sử dụng `notion://docs/enhanced-markdown-spec` để hiểu đúng format
4. **Create report page**: Sử dụng `notion-create-pages` với:
   - `parent.page_id`: ID của destination page
   - `properties.title`: Tiêu đề báo cáo
   - `content`: Nội dung báo cáo theo Notion Markdown format
5. **Confirm**: Chia sẻ URL của page vừa tạo cho user

### Fallback

Nếu Notion MCP không khả dụng:
- Thông báo cho user
- File `.md` đã tạo vẫn là báo cáo hoàn chỉnh
- User có thể tự copy-paste nội dung lên Notion

---

## Key Principles

- Mỗi báo cáo **luôn có cả PA và DA** — không được bỏ qua phần nào
- **Hỏi từng câu một** — không dồn nhiều câu hỏi
- **Tiếng Việt** — toàn bộ báo cáo
- **Review trước khi publish** — không tự động tạo Notion page
- **Tận dụng context** — dùng Notion source page để giảm số câu hỏi
