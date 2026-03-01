---
id: internals
title: Nội bộ dự án & Đóng góp
sidebar_position: 5
description: Hướng dẫn cho contributor muốn hiểu hoặc mở rộng codebase AIDK.
---

# Nội bộ dự án & Đóng góp

## Cấu trúc source code

```
ai-dev-kit/
├── src/
│   ├── index.ts          # Entry point CLI (Commander.js)
│   ├── commands/         # Các lệnh CLI (init, add)
│   ├── generators/       # Logic sinh file từ template
│   └── utils/            # Tiện ích (file system, logging)
├── templates/            # Template files cho rules/skills/workflows/docs
│   ├── rules/
│   ├── skills/
│   ├── workflows/
│   └── docs/
├── tests/                # Unit & integration tests (Vitest)
├── tsconfig.json
└── tsup.config.ts        # Build config
```

## Cách hoạt động

1. **CLI Entry point** (`src/index.ts`): Khởi tạo Commander.js và đăng ký các subcommands.
2. **Command handler** (`src/commands/`): Xử lý logic cho từng lệnh (`init`, `add`).
3. **Generator** (`src/generators/`): Đọc template từ `templates/`, render và ghi ra filesystem.
4. **Templates** (`templates/`): Các file markdown/JSON mẫu được copy vào dự án người dùng.

## Cài đặt môi trường phát triển

```bash
git clone https://git.caerux.com/caeruxlab/clx-ai-kit.git
cd clx-ai-kit
npm install
npm run dev    # Watch mode build
```

## Chạy tests

```bash
npm test               # Chạy toàn bộ test suite
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## Build

```bash
npm run build
```

Output sẽ được tạo tại thư mục `dist/`.

## Thêm một Command mới

1. Tạo file handler trong `src/commands/<command-name>.ts`.
2. Đăng ký command trong `src/index.ts`.
3. Thêm template (nếu cần) vào `templates/`.
4. Viết test trong `tests/`.

## Lint & Type check

```bash
npm run lint   # TypeScript type check (tsc --noEmit)
```

## Quy tắc coding

- **Không có `console.log`** — Dùng `picocolors` để format output CLI.
- **File nhỏ** — Tối đa 800 dòng, lý tưởng 200–400 dòng.
- **Immutable patterns** — Không mutate trực tiếp object/array.
- **Named exports** — Ưu tiên named exports thay vì default exports trong modules nội bộ.
