# @caeruxlab/aidk

Công cụ CLI để tạo cấu trúc phát triển hỗ trợ bởi AI cho **Cursor**, **Antigravity** (Google IDE), và **Claude Code**.

Quản lý rules, skills, commands/workflows, và các template tài liệu trên các dự án.

## Cài đặt

### Yêu cầu hệ thống

- Node.js >= 24

### Cấu hình npm cho GitLab Package Registry

Để cài đặt `@caeruxlab/aidk`, bạn cần cấu hình npm để trỏ tới CaeruxLab GitLab Registry.

1.  **Tạo Personal Access Token (PAT):**
    *   Đăng nhập vào tài khoản GitLab của bạn.
    *   Truy cập **User Settings** (Menu thả xuống ở avatar) -> **Access Tokens**.
    *   Tạo một token mới với tên "AIDK".
    *   Dưới phần **Scopes** (hoặc **Permissions**), chọn ô **`api`**.
    *   Nhấn "Create personal access token" ở cuối trang.
    *   Sao chép mã token được tạo.

2.  **Thêm vào file `~/.npmrc` của bạn:**

    Thay thế `YOUR_GITLAB_TOKEN` bằng mã token bạn vừa tạo:

```
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/
//git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/:_authToken=YOUR_GITLAB_TOKEN
```

### Cài đặt

```bash
npm install -g @caeruxlab/aidk
```

Hoặc sử dụng trực tiếp với `npx`:

```bash
npx @caeruxlab/aidk init
```

### Cập nhật

```bash
npm install -g @caeruxlab/aidk
```

Hoặc sử dụng trực tiếp với `npx`:

```bash
npx @caeruxlab/aidk update
```

## Lệnh (Commands)

### `aidk init`

Khởi tạo AI DevKit trong dự án hiện tại với các lời nhắc tương tác.

> **Mẹo thao tác**: Sử dụng **phím mũi tên Lên/Xuống** để di chuyển, nhấn **Space** để chọn hoặc bỏ chọn một mục, và nhấn **Enter** để xác nhận lựa chọn của bạn.

```bash
aidk init
aidk init --force  # ghi đè cấu hình hiện có
```

Các lựa chọn:
- Chọn Môi trường (Cursor, Antigravity, Claude Code, hoặc nhiều môi trường)
- Các giai đoạn tài liệu (Phases) cần tạo
- Các Skill cần cài đặt

### `aidk add <type> <name>`

Thêm một thành phần đơn lẻ vào dự án.

```bash
aidk add skill cxl-fastapi
aidk add command write-tests
aidk add rule coding-style
aidk add phase testing
```

### `aidk remove <type> <name>`

Xóa một thành phần với xác nhận.

```bash
aidk remove skill cxl-ansible
aidk remove command debug
```

### `aidk list [type]`

Hiển thị các thành phần có sẵn và đã cài đặt.

```bash
aidk list           # tất cả các loại thành phần
aidk list skills    # chỉ skills
aidk list commands  # chỉ commands
```

### `aidk update`

Cập nhật các thành phần đã cài đặt lên phiên bản mới nhất được đóng gói kèm theo. Hiển thị tóm tắt các thay đổi (diff) và yêu cầu xác nhận trước khi ghi đè bất kỳ tệp nào.

```bash
aidk update
```

## Cấu hình

CLI theo dõi trạng thái dự án trong tệp `.ai-devkit.json`:

```json
{
  "version": "1.0.0",
  "cliVersion": "0.1.0",
  "environments": ["cursor", "antigravity", "claude-code"],
  "initializedPhases": ["requirements", "design", "planning"],
  "installedSkills": ["cxl-brainstorming", "cxl-fastapi"],
  "installedCommands": ["new-requirement", "execute-plan"],
  "installedRules": ["0-force-rule", "3-coding-style"]
}
```

## Ánh xạ thư mục IDE/Môi trường (IDE/Environment Directory Mapping)

| Thành phần | Cursor | Antigravity | Claude Code |
|-----------|--------|-------------|-------------|
| Skills | `.cursor/skills/{name}/` | `.agent/skills/{name}/` | `.claude/skills/{name}/` |
| Commands | `.cursor/commands/{name}.md` | `.agent/workflows/{name}.md` | `.claude/commands/{name}.md` |
| Rules | `.cursor/rules/{name}.mdc` | `.agent/rules/{name}.md` | `.claude/rules/{name}.md` |
| Phases | `docs/ai/{name}/` | `docs/ai/{name}/` | `docs/ai/{name}/` |
| Ghi nhớ | `AGENTS.md` | (Dùng ngữ cảnh của IDE) | `CLAUDE.md` |

## Phát triển (Development)

```bash
npm install
npm run build
npm link        # link cục bộ để kiểm tra
npm test        # chạy tests
npm run lint    # kiểm tra kiểu dữ liệu (type check)
npm unlink -g @caeruxlab/aidk      # unlink for production
```

## Giấy phép (License)

MIT
