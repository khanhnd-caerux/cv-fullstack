---
id: setup
title: Cài đặt & Cấu hình
sidebar_position: 2
description: Hướng dẫn cài đặt AIDK CLI và khởi tạo cấu trúc cho dự án của bạn.
---

# Cài đặt & Cấu hình

## Yêu cầu hệ thống

- **Node.js** >= 24
- **npm** >= 10

## Cài đặt toàn cục

```bash
npm install -g @caeruxlab/aidk
```

Hoặc nếu bạn dùng registry GitLab của CaeruxLab, cần cấu hình `.npmrc` trước:

1.  **Tạo Personal Access Token (PAT):**
    *   Đăng nhập vào tài khoản GitLab của bạn.
    *   Truy cập **User Settings** (Menu thả xuống ở avatar) -> **Access Tokens**.
    *   Tạo một token mới với tên "AIDK".
    *   Dưới phần **Scopes** (hoặc **Permissions**), chọn ô **`api`**.
    *   Nhấn "Create personal access token" ở cuối trang.
    *   Sao chép mã token được tạo.

2.  **Cấu hình `.npmrc`:**

    Thêm đoạn sau vào file `~/.npmrc` hoặc `.npmrc` trong thư mục dự án và thay thế `YOUR_GITLAB_TOKEN` bằng token bạn vừa tạo:

```bash
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/
//git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/:_authToken=YOUR_GITLAB_TOKEN
```

Sau đó cài đặt:

```bash
npm install -g @caeruxlab/aidk
```

## Kiểm tra cài đặt

```bash
aidk --version
```

## Khởi tạo dự án

Trong thư mục gốc của dự án của bạn, chạy:

```bash
aidk init
```

Lệnh này sẽ:
1. Tạo thư mục `.agent/` với cấu trúc rules, skills, và workflows.
2. Tạo thư mục `docs/ai/` với template tài liệu.
3. Tạo file `.ai-devkit.json` với cấu hình dự án.

## Cấu trúc sau khi khởi tạo

```
your-project/
├── .agent/
│   ├── rules/          # Quy tắc hướng dẫn AI
│   ├── skills/         # Kỹ năng chuyên biệt của AI
│   └── workflows/      # Lệnh slash workflows
├── docs/
│   └── ai/
│       ├── requirements/
│       ├── design/
│       ├── planning/
│       ├── implementation/
│       └── testing/
└── .ai-devkit.json
```

## Cấu hình `.ai-devkit.json`

File `.ai-devkit.json` lưu trữ thông tin cấu hình của dự án:

```json
{
  "version": "1.0.0",
  "cliVersion": "0.1.0",
  "environments": ["cursor", "antigravity", "claude-code"]
}
```

| Trường | Mô tả |
|--------|-------|
| `version` | Phiên bản config |
| `cliVersion` | Phiên bản AIDK CLI |
| `environments` | Môi trường hệ thống (`cursor`, `antigravity`, `claude-code`) |
