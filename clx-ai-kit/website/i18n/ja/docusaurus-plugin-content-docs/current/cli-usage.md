---
id: cli-usage
title: CLIリファレンス
sidebar_position: 3
description: AIDK CLIコマンドの全リファレンス。
---

# CLIリファレンス

## コマンド概要

```bash
aidk [command] [options]
```

| コマンド | 説明 |
|---------|------|
| `aidk init` | 現在のプロジェクトにAIDK構造を初期化する |
| `aidk add rule <name>` | 新しいルールを追加する |
| `aidk add skill <name>` | 新しいスキルを追加する |
| `aidk add workflow <name>` | 新しいワークフローを追加する |
| `aidk update` | レジストリからコンポーネントを確認して更新する |
| `aidk --version` | 現在のバージョンを表示する |
| `aidk --help` | ヘルプを表示する |

## `aidk init`

現在のディレクトリにAIDKを初期化します。

> **操作のヒント**: インタラクティブなプロンプトでは、**上下の矢印キー**で移動し、**スペースキー**を押して項目の選択・解除を行い、**Enterキー**で選択を確定します。

```bash
aidk init
```

**オプション：**
- `--ide <cursor|antigravity|claude-code>` — 対象IDE（デフォルト：`antigravity`）
- `--force` — 構造が既に存在する場合に上書きする

**例：**

```bash
# Cursor IDE用に初期化
aidk init --ide cursor

# 既存の構造を上書き
aidk init --force
```

## `aidk add rule`

`.agent/rules/` に新しいルールファイルを追加します。

```bash
aidk add rule <name>
```

**例：**

```bash
aidk add rule security
# 作成：.agent/rules/security.md
```

## `aidk add skill`

`.agent/skills/` に新しいスキルを追加します。

```bash
aidk add skill <name>
```

**例：**

```bash
aidk add skill fastapi
# 作成：.agent/skills/fastapi/SKILL.md
```

## `aidk add workflow`

`.agent/workflows/` に新しいワークフローを追加します。

```bash
aidk add workflow <name>
```

**例：**

```bash
aidk add workflow deploy
# 作成：.agent/workflows/deploy.md
```

## `aidk update`

インストール済みのコンポーネントの変更を確認し、レジストリから新しいコンポーネントを探索します。

```bash
aidk update
```

このコマンドは以下の操作を実行します：

1.  **変更の確認**: プロジェクト内の現在のルール、スキル、ワークフローをAIDKレジストリの最新バージョンと比較します。
2.  **新しいコンポーネントの探索**: レジストリにある、まだインストールされていない新しいコンポーネント（ルール、スキル、ワークフロー）を自動的に特定します。
3.  **選択的な更新**: インタラクティブなインターフェースを提供し、すべてを更新するか、特定のコンポーネントを選択するかを確認します。

**例：**

```bash
# プロジェクト全体を確認して更新する
aidk update
```

## よくあるエラー

| エラー | 原因 | 解決策 |
|-------|------|--------|
| `Command not found: aidk` | インストールされていないかPATHが未設定 | `npm install -g @caeruxlab/aidk` を実行 |
| `ENOENT: .agent already exists` | ディレクトリが既に存在する | `--force` フラグを使用 |
| `403 Forbidden` | npmレジストリ認証エラー | `.npmrc` とGitLabトークンを確認 |
