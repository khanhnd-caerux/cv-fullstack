# Docusaurus Templates & Examples

This file contains templates and examples for creating Docusaurus documentation. For workflow guidance, see [SKILL.md](SKILL.md).

## Complete Document Template (Vietnamese)

Use this template when creating new Vietnamese documentation:

```markdown
---
sidebar_position: 1
id: feature-name
title: Tên Tính Năng
description: Mô tả ngắn gọn về tính năng này và cách sử dụng.
---

# Tên Tính Năng

Giới thiệu ngắn gọn về tính năng này.

## Yêu Cầu

- Yêu cầu 1
- Yêu cầu 2

## Cài Đặt

### Bước 1: Cài đặt

```bash
npm install package-name
```

### Bước 2: Cấu hình

```javascript
// Ví dụ code
const config = {
  // cấu hình
};
```

## Sử Dụng

### Ví dụ Cơ Bản

```javascript
// Code example
```

### Ví dụ Nâng Cao

```javascript
// Advanced code example
```

## API Reference

### Function Name

**Mô tả:** Mô tả function

**Tham số:**
- `param1` (type): Mô tả
- `param2` (type): Mô tả

**Trả về:** Mô tả giá trị trả về

**Ví dụ:**
```javascript
// Example usage
```

## Troubleshooting

### Vấn Đề Thường Gặp

**Lỗi:** Mô tả lỗi

**Giải pháp:** Cách khắc phục

## Xem Thêm

- [Link to related doc](./related-doc.md)
- [External resource](https://example.com)
```

## Translation Examples

### Example 1: Simple Document

**Vietnamese (docs/example.md):**
```markdown
---
id: example
title: Ví dụ
description: Đây là một ví dụ
---

# Ví dụ

Nội dung tiếng Việt...
```

**English (i18n/en/docusaurus-plugin-content-docs/current/example.md):**
```markdown
---
id: example
title: Example
description: This is an example
---

# Example

English content...
```

**Japanese (i18n/ja/docusaurus-plugin-content-docs/current/example.md):**
```markdown
---
id: example
title: 例
description: これは例です
---

# 例

日本語のコンテンツ...
```

### Example 2: Document with Code Blocks

**Vietnamese:**
```markdown
---
id: api-reference
title: Tham Chiếu API
description: Tài liệu tham chiếu API đầy đủ
---

# Tham Chiếu API

## Khởi Tạo

```javascript
// Khởi tạo ứng dụng
const app = initialize();
```

## Sử Dụng

```javascript
// Gọi API
app.call('method', params);
```
```

**English:**
```markdown
---
id: api-reference
title: API Reference
description: Complete API reference documentation
---

# API Reference

## Initialization

```javascript
// Initialize application
const app = initialize();
```

## Usage

```javascript
// Call API
app.call('method', params);
```
```

**Japanese:**
```markdown
---
id: api-reference
title: APIリファレンス
description: 完全なAPIリファレンスドキュメント
---

# APIリファレンス

## 初期化

```javascript
// アプリケーションを初期化
const app = initialize();
```

## 使用方法

```javascript
// APIを呼び出す
app.call('method', params);
```
```

## Code Block Translation Patterns

### Pattern 1: Comments Only

**Keep code identical, translate comments:**

```javascript
// Vietnamese version
// Khởi tạo ứng dụng
const app = initialize();

// English version  
// Initialize application
const app = initialize();

// Japanese version
// アプリケーションを初期化
const app = initialize();
```

### Pattern 2: String Literals

**Translate string literals if they're user-facing:**

```javascript
// Vietnamese
const message = "Xin chào";

// English
const message = "Hello";

// Japanese
const message = "こんにちは";
```

### Pattern 3: Documentation Strings

**Translate docstrings and comments:**

```python
# Vietnamese
def function_name():
    """
    Mô tả function bằng tiếng Việt.
    """
    pass

# English
def function_name():
    """
    Function description in English.
    """
    pass

# Japanese
def function_name():
    """
    関数の説明を日本語で。
    """
    pass
```

## Link Translation Patterns

### Internal Links

Keep file paths identical, translate link text:

```markdown
<!-- Vietnamese -->
[Xem hướng dẫn](./getting-started.md)

<!-- English -->
[See guide](./getting-started.md)

<!-- Japanese -->
[ガイドを見る](./getting-started.md)
```

### External Links

Translate link text, keep URL:

```markdown
<!-- Vietnamese -->
[Tài liệu chính thức](https://docusaurus.io)

<!-- English -->
[Official documentation](https://docusaurus.io)

<!-- Japanese -->
[公式ドキュメント](https://docusaurus.io)
```

## Front Matter Patterns

### Basic Front Matter

```markdown
---
sidebar_position: 1
id: unique-doc-id
title: Document Title
description: Brief description
---
```

### With Custom Metadata

```markdown
---
sidebar_position: 1
id: unique-doc-id
title: Document Title
description: Brief description
tags:
  - tag1
  - tag2
keywords:
  - keyword1
  - keyword2
---
```

### With Custom Sidebar

```markdown
---
sidebar_position: 1
id: unique-doc-id
title: Document Title
description: Brief description
sidebar_class_name: custom-sidebar-class
---
```

## AI Agent Quick Reference

### When Creating New Docs

1. ✅ Create Vietnamese version in `docs/`
2. ✅ Copy to `i18n/en/docusaurus-plugin-content-docs/current/`
3. ✅ Copy to `i18n/ja/docusaurus-plugin-content-docs/current/`
4. ✅ Translate front matter and content
5. ✅ Keep `id` and `sidebar_position` identical
6. ✅ Test all locales

### When Updating Docs

1. ✅ Update Vietnamese version
2. ✅ Update English version
3. ✅ Update Japanese version
4. ✅ Maintain consistency across all locales

### Translation Priorities

- Technical accuracy > Literal translation
- Clarity > Word-for-word matching
- Consistency > Perfect grammar
- Complete content > Partial translation

## Common Document Types

### Getting Started Guide

```markdown
---
id: getting-started
title: Bắt Đầu
description: Hướng dẫn bắt đầu nhanh
---

# Bắt Đầu

## Yêu Cầu

- Requirement 1
- Requirement 2

## Cài Đặt

[Installation steps]

## Bước Tiếp Theo

- [Next step 1](./next-step-1.md)
- [Next step 2](./next-step-2.md)
```

### API Documentation

```markdown
---
id: api-overview
title: Tổng Quan API
description: Tổng quan về API
---

# Tổng Quan API

## Endpoints

### GET /api/resource

**Mô tả:** Lấy danh sách resource

**Tham số:**
- `page` (number): Số trang
- `limit` (number): Giới hạn số lượng

**Trả về:** Danh sách resource

**Ví dụ:**
```bash
curl https://api.example.com/resource?page=1&limit=10
```
```

### Tutorial

```markdown
---
id: tutorial-basics
title: Hướng Dẫn Cơ Bản
description: Hướng dẫn từng bước
---

# Hướng Dẫn Cơ Bản

## Mục Tiêu

Mục tiêu của hướng dẫn này...

## Bước 1: Thiết Lập

[Step content]

## Bước 2: Cấu Hình

[Step content]

## Tổng Kết

[Tutorial summary]
```

## Terminology Consistency

### Technical Terms

Maintain consistent technical terms across languages:

| Vietnamese | English | Japanese |
|------------|---------|----------|
| API | API | API |
| Cơ sở dữ liệu | Database | データベース |
| Máy chủ | Server | サーバー |
| Ứng dụng | Application | アプリケーション |

### Project-Specific Terms

Document project-specific terminology in a glossary:

```markdown
---
id: glossary
title: Thuật Ngữ
---

# Thuật Ngữ

## Thuật Ngữ Dự Án

- **Term 1**: Định nghĩa
- **Term 2**: Định nghĩa
```
