---
id: examples
title: Ví dụ sử dụng
sidebar_position: 4
description: Các ví dụ thực tế về cách sử dụng AIDK trong dự án.
---

# Ví dụ sử dụng

## Ví dụ 1: Khởi tạo dự án FastAPI + Next.js

Giả sử bạn có một dự án full-stack mới với FastAPI (backend) và Next.js (frontend).

```bash
# Bước 1: Khởi tạo cấu trúc AIDK
cd my-fullstack-project
aidk init

# Bước 2: Thêm skill FastAPI
aidk add skill fastapi

# Bước 3: Thêm skill PostgreSQL
aidk add skill postgres-patterns
```

Sau đó, trong IDE của bạn, AI sẽ tự động đọc các skills này và áp dụng best practices cho FastAPI và PostgreSQL khi bạn yêu cầu.

## Ví dụ 2: Tạo tài liệu yêu cầu cho tính năng mới

Sử dụng workflow `/new-requirement` để tạo tài liệu đầy đủ từ yêu cầu đến kế hoạch:

```
@[/new-requirement] user-authentication
```

AI sẽ hướng dẫn bạn qua các bước:
1. Mô tả vấn đề cần giải quyết
2. Xác định người dùng và use cases
3. Định nghĩa tiêu chí thành công
4. Tạo file tài liệu đầy đủ tại `docs/ai/`

## Ví dụ 3: Review code trước khi push

```
@[/code-review]
```

AI sẽ:
- So sánh implementation với tài liệu design
- Kiểm tra coding style theo rules đã định nghĩa
- Báo cáo các vấn đề cần sửa

## Ví dụ 4: Debug một vấn đề phức tạp

```
@[/debug] API trả về lỗi 500 khi tạo user mới
```

AI sẽ thực hiện phân tích root cause có cấu trúc trước khi đề xuất sửa code.

## Ví dụ 5: Thực thi kế hoạch triển khai

Sau khi tạo tài liệu planning với `/new-requirement`, bắt đầu triển khai:

```
@[/execute-plan] user-authentication
```

AI sẽ đọc `docs/ai/planning/feature-user-authentication.md` và thực hiện từng task một cách có kiểm soát.
