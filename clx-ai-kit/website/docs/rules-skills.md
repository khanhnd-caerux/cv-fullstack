---
id: rules-skills
title: Rules & Skills
sidebar_position: 6
description: Giải thích chi tiết về hệ thống Rules và Skills trong AIDK.
---

# Rules & Skills

AIDK sử dụng hai cơ chế chính để hướng dẫn AI: **Rules** và **Skills**. Cả hai đều được đặt trong thư mục `.agent/`.

## Rules

Rules là các file `.md` trong `.agent/rules/`. AI đọc chúng trước **mọi tác vụ** để hiểu các ràng buộc và tiêu chuẩn của dự án.

### Cấu trúc một Rule

```markdown
# Tên Rule

## Mô tả
Mô tả ngắn gọn về rule này làm gì.

## Quy tắc bắt buộc
- Quy tắc 1
- Quy tắc 2

## Ví dụ đúng
...

## Ví dụ sai
...
```

### Các Rules mặc định

| Rule | Ưu tiên | Mô tả |
|------|---------|-------|
| `0-force-rule.md` | 0 (cao nhất) | Buộc AI review tất cả rules/skills trước khi làm việc |
| `2-dotenv-environments.md` | 2 | Chuẩn cấu hình biến môi trường với file `.env` |
| `3-coding-style.md` | 3 | Quy tắc coding style (file size, immutability, v.v.) |

### Thứ tự ưu tiên

Rules có số thứ tự nhỏ hơn sẽ được AI ưu tiên cao hơn. Ví dụ: `0-force-rule.md` luôn được áp dụng trước tiên.

---

## Skills

Skills là các thư mục trong `.agent/skills/`, mỗi thư mục chứa ít nhất một file `SKILL.md`. Skills cung cấp hướng dẫn **chuyên biệt theo từng công nghệ hoặc tác vụ cụ thể**.

### Cấu trúc một Skill

```
.agent/skills/
└── my-skill/
    ├── SKILL.md        # Hướng dẫn chính (bắt buộc)
    ├── examples/       # Ví dụ tham khảo (tùy chọn)
    └── templates/      # Template file (tùy chọn)
```

### `SKILL.md` frontmatter

```yaml
---
name: my-skill
description: >
  Mô tả khi nào nên dùng skill này.
  AI sẽ đọc mô tả này để quyết định có áp dụng skill hay không.
---
```

### Các Skills có sẵn

| Skill | Khi nào dùng |
|-------|-------------|
| `cxl-brainstorming` | Trước mọi công việc sáng tạo/xây dựng |
| `cxl-fastapi` | Phát triển REST API với FastAPI |
| `cxl-docusaurus-setup` | Tạo/cập nhật trang tài liệu Docusaurus |
| `cxl-terraform` | Làm việc với Terraform/OpenTofu |
| `cxl-ansible` | Viết Ansible playbooks |
| `cxl-postgres-patterns` | Thiết kế schema và query PostgreSQL |
| `cxl-dynamodb` | Mô hình hóa dữ liệu DynamoDB |
| `cxl-aws-architecture` | Thiết kế kiến trúc AWS |
| `cxl-security-review` | Review bảo mật khi thêm auth/API |
| `cxl-python` | Chuẩn code Python |
| `cxl-coding-standards` | Chuẩn TypeScript/JavaScript/React |
| `cxl-seo` | Tối ưu SEO |
| `cxl-gitignore` | Tạo/cập nhật `.gitignore` |
| `cxl-report-po` | Tạo báo cáo PA/DA từ Notion |

### Tạo skill mới

```bash
aidk add skill my-new-skill
# Tạo: .agent/skills/my-new-skill/SKILL.md
```

Sau đó chỉnh sửa `SKILL.md` theo nhu cầu của dự án.

---

## Workflows

Workflows là các file `.md` trong `.agent/workflows/` định nghĩa quy trình làm việc có thể gọi bằng lệnh slash.

### Các Workflows mặc định

| Workflow | Slash command | Mô tả |
|----------|--------------|-------|
| `new-requirement.md` | `/new-requirement` | Tạo tài liệu từ yêu cầu đến kế hoạch |
| `execute-plan.md` | `/execute-plan` | Thực thi kế hoạch task từng bước |
| `code-review.md` | `/code-review` | Review code trước khi push |
| `debug.md` | `/debug` | Debug với phân tích root cause |
| `write-tests.md` | `/write-tests` | Viết tests cho tính năng mới |
| `create-report-po.md` | `/create-report-po` | Tạo báo cáo PA/DA từ Notion |
