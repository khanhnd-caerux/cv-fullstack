---
sidebar_position: 9
id: docusaurus-guide
---

# Hướng dẫn cập nhật Tài liệu dự án

Tài liệu của AIDK được xây dựng bằng [Docusaurus v3](https://docusaurus.io/). Bài viết này hướng dẫn các Cộng tác viên cách cài đặt môi trường, tạo trang mới và quản lý biên dịch đa ngôn ngữ cho website tài liệu.

## 1. Cài đặt môi trường cục bộ

Toàn bộ mã nguồn trang web tài liệu nằm trong thư mục `website/`.

```bash
cd website
npm install
```

### Chạy Development Server

Docusaurus hỗ trợ tải lại trực tiếp (live reload). Bạn có thể chạy riêng từng ngôn ngữ để kiểm tra:

```bash
# Chạy tiếng Việt (ngôn ngữ mặc định) tại http://localhost:3000
npm start

# Chạy tiếng Anh tại http://localhost:3000/en/
npm start -- --locale en

# Chạy tiếng Nhật tại http://localhost:3000/ja/
npm start -- --locale ja
```

## 2. Thêm một bài viết mới

Tiếng Việt là ngôn ngữ mặc định (source of truth) của dự án. Tất cả bài viết mới trước tiên phải được viết bằng tiếng Việt.

1. Tạo một file Markdown (`.md`) mới bên trong thư mục `website/docs/`.
2. Bắt buộc cung cấp **Frontmatter** ở đầu file với các trường id và vị trí:

```markdown
---
sidebar_position: 10
id: my-new-guide
---

# Tiêu đề bài viết
Nội dung bài viết bắt đầu từ đây.
```

## 3. Quản lý Đa ngôn ngữ (i18n)

Sau khi bài viết tiếng Việt đã hoàn thiện, bạn cần cung cấp bản dịch tiếng Anh và tiếng Nhật.

### Sao chép cấu trúc thư mục

Bản dịch nội dung Markdown được lưu trong `website/i18n/{locale}/docusaurus-plugin-content-docs/current/`.

```bash
# Giả sử bạn vừa tạo thư mục mới hoặc file mới, hãy sao chép nó
cp website/docs/my-new-guide.md website/i18n/en/docusaurus-plugin-content-docs/current/
cp website/docs/my-new-guide.md website/i18n/ja/docusaurus-plugin-content-docs/current/
```

**Lưu ý quan trọng**: Frontmatter (`sidebar_position` và `id`) của các bản dịch **Dịch thuật** phải giữ nguyên không đổi so với bản tiếng Việt. Bạn chỉ tiến hành dịch phần nội dung bên dưới frontmatter.

### Cập nhật Sidebar và Navbar

Nếu bạn thêm một menu xổ xuống, hoặc đổi tên mục ở Sidebar (`sidebars.ts`), bạn cần cung cấp bản dịch cho các nhãn (label) đó. Thay vì đoán tên Key của bản dịch, hãy dùng lệnh tự động sau:

```bash
cd website
npm run docusaurus write-translations -- --locale en
npm run docusaurus write-translations -- --locale ja
```

Lệnh này sẽ quét toàn bộ file config và xuất ra cấu trúc Key Json được yêu cầu vào thư mục `i18n/{locale}/`. Bạn mở file `current.json` (cho sidebar) và `navbar.json` để dịch thuộc tính `message`.

## 4. Biên dịch (Build) và CI/CD

Trước khi đẩy code (push) lên nhánh `main`, bạn nên chạy thử build production ở máy cục bộ để kiểm tra lỗi liên kết (broken links), Docusaurus cực kỳ nghiêm ngặt với các lỗi link hỏng.

```bash
npm run build
```

Nếu lệnh trên báo `[SUCCESS] Generated static files`, bạn có thể an tâm commit. Khi push lên nhánh `main`, hệ thống GitLab CI/CD (Job `pages`) sẽ tự động lấy thư mục `build/` để deploy lên GitLab Pages của dự án.
