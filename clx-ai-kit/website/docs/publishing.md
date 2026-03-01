---
id: publishing
title: Xuất bản (Publishing)
sidebar_position: 7
description: Hướng dẫn quy trình xuất bản package AIDK lên GitLab Package Registry.
---

# Xuất bản (Publishing)

AIDK được xuất bản lên **GitLab Package Registry** thay vì npm public registry. Dưới đây là toàn bộ quy trình.

## Yêu cầu trước khi xuất bản

1. Bạn phải là thành viên có quyền `Maintainer` hoặc `Owner` trên project GitLab.
2. Đã có **Personal Access Token** (PAT) với scope `api` hoặc `write_registry`.
3. File `.npmrc` được cấu hình đúng.

## Bước 1: Cấu hình `.npmrc`

Tạo hoặc cập nhật file `.npmrc` ở thư mục gốc dự án:

```ini
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/
//git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/:_authToken=${NPM_TOKEN}
```

:::caution
Không commit token thực vào file `.npmrc`. Dùng biến môi trường `NPM_TOKEN`.
:::

## Bước 2: Đặt biến môi trường

```bash
export NPM_TOKEN=your-personal-access-token
```

## Bước 3: Build trước khi xuất bản

```bash
npm run build
```

Kiểm tra kết quả build trong thư mục `dist/`.

## Bước 4: Cập nhật version

Dùng `npm version` để cập nhật `package.json` theo [Semantic Versioning](https://semver.org):

```bash
# Patch (0.2.0 -> 0.2.1)
npm version patch

# Minor (0.2.0 -> 0.3.0)
npm version minor

# Major (0.2.0 -> 1.0.0)
npm version major
```

## Bước 5: Xuất bản

```bash
npm publish
```

Lệnh `prepublishOnly` trong `package.json` sẽ tự động chạy `npm run build` trước khi publish.

## Xuất bản qua GitLab CI/CD (Tự động)

Quy trình thủ công trên đây chỉ dành cho trường hợp cần thiết. Thông thường, việc xuất bản được thực hiện **tự động qua GitLab CI/CD** khi merge vào nhánh `main`.

Xem chi tiết cấu hình tại **[Cấu hình GitLab](./gitlab-setup.md)**.

## Kiểm tra sau khi xuất bản

Sau khi publish, kiểm tra package đã có mặt tại:
- GitLab UI: **Project → Deploy → Package Registry**
- Hoặc thử cài đặt: `npm install -g @caeruxlab/aidk@<version>`

## Cập nhật CHANGELOG

Luôn cập nhật file `CHANGELOG.md` trước khi xuất bản để ghi lại các thay đổi trong version mới.
