---
id: cli-usage
title: Sử dụng CLI
sidebar_position: 3
description: Tham khảo đầy đủ các lệnh CLI của AIDK.
---

# Sử dụng CLI

## Tổng quan các lệnh

```bash
aidk [command] [options]
```

| Lệnh | Mô tả |
|------|-------|
| `aidk init` | Khởi tạo cấu trúc AIDK trong dự án hiện tại |
| `aidk add rule <name>` | Thêm một rule mới |
| `aidk add skill <name>` | Thêm một skill mới |
| `aidk add workflow <name>` | Thêm một workflow mới |
| `aidk update` | Kiểm tra và cập nhật các thành phần từ registry |
| `aidk --version` | Xem phiên bản hiện tại |
| `aidk --help` | Hiển thị trợ giúp |

## `aidk init`

Khởi tạo cấu trúc AIDK trong thư mục hiện tại.

> **Mẹo thao tác**: Đối với các lệnh tương tác (nhiều lựa chọn), hãy sử dụng **phím mũi tên Lên/Xuống** để di chuyển, nhấn **Space** để chọn hoặc bỏ chọn một mục, và nhấn **Enter** để xác nhận lựa chọn của bạn.

```bash
aidk init
```

**Tùy chọn:**
- `--ide <cursor|antigravity|claude-code>` — Chỉ định IDE (mặc định: `antigravity`)
- `--force` — Ghi đè nếu cấu trúc đã tồn tại

**Ví dụ:**

```bash
# Khởi tạo cho Cursor IDE
aidk init --ide cursor

# Ghi đè cấu trúc cũ
aidk init --force
```

## `aidk add rule`

Thêm một file rule mới vào `.agent/rules/`.

```bash
aidk add rule <name>
```

**Ví dụ:**

```bash
aidk add rule security
# Tạo: .agent/rules/security.md
```

## `aidk add skill`

Thêm một skill mới vào `.agent/skills/`.

```bash
aidk add skill <name>
```

**Ví dụ:**

```bash
aidk add skill fastapi
# Tạo: .agent/skills/fastapi/SKILL.md
```

## `aidk add workflow`

Thêm một workflow mới vào `.agent/workflows/`.

```bash
aidk add workflow <name>
```

**Ví dụ:**

```bash
aidk add workflow deploy
# Tạo: .agent/workflows/deploy.md
```

## `aidk update`

Kiểm tra sự thay đổi của các thành phần đã cài đặt và khám phá các thành phần mới từ registry.

```bash
aidk update
```

Lệnh này sẽ thực hiện các bước sau:

1.  **Kiểm tra thay đổi**: So sánh các file rules, skills, workflows hiện tại trong dự án của bạn với phiên bản mới nhất trong registry của AIDK.
2.  **Khám phá thành phần mới**: Tự động tìm các thành phần (rules, skills, workflows) mới được thêm vào AIDK mà bạn chưa cài đặt.
3.  **Cập nhật có chọn lọc**: Cung cấp giao diện tương tác để bạn chọn cập nhật tất cả hoặc chỉ chọn một số thành phần cụ thể.

**Ví dụ:**

```bash
# Kiểm tra và cập nhật toàn bộ dự án
aidk update
```

## Xử lý lỗi phổ biến

| Lỗi | Nguyên nhân | Giải pháp |
|-----|------------|-----------|
| `Command not found: aidk` | Chưa cài đặt hoặc PATH chưa đúng | Chạy `npm install -g @caeruxlab/aidk` |
| `ENOENT: .agent already exists` | Thư mục đã tồn tại | Dùng cờ `--force` |
| `403 Forbidden` | Lỗi xác thực npm registry | Kiểm tra `.npmrc` và token GitLab |
