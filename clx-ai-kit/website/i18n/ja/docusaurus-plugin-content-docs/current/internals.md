---
id: internals
title: プロジェクト内部とコントリビューション
sidebar_position: 5
description: AIDKコードベースを理解または拡張したいコントリビューター向けガイド。
---

# プロジェクト内部とコントリビューション

## ソースコード構造

```
ai-dev-kit/
├── src/
│   ├── index.ts          # CLIエントリポイント（Commander.js）
│   ├── commands/         # CLIコマンドハンドラー（init、add）
│   ├── generators/       # テンプレートからのファイル生成ロジック
│   └── utils/            # ユーティリティ（ファイルシステム、ロギング）
├── templates/            # rules/skills/workflows/docsのテンプレートファイル
│   ├── rules/
│   ├── skills/
│   ├── workflows/
│   └── docs/
├── tests/                # ユニット＆統合テスト（Vitest）
├── tsconfig.json
└── tsup.config.ts        # ビルド設定
```

## 動作の仕組み

1. **CLIエントリポイント** (`src/index.ts`)：Commander.jsを初期化しサブコマンドを登録します。
2. **コマンドハンドラー** (`src/commands/`)：各コマンド（`init`、`add`）のロジックを処理します。
3. **ジェネレーター** (`src/generators/`)：`templates/` からテンプレートを読み取り、レンダリングしてファイルシステムに書き込みます。
4. **テンプレート** (`templates/`)：ユーザーのプロジェクトにコピーされるMarkdown/JSONテンプレートファイル。

## 開発環境のセットアップ

```bash
git clone https://git.caerux.com/caeruxlab/clx-ai-kit.git
cd clx-ai-kit
npm install
npm run dev    # ウォッチモードビルド
```

## テストの実行

```bash
npm test               # テストスイート全体を実行
npm run test:watch     # ウォッチモード
npm run test:coverage  # カバレッジレポート
```

## ビルド

```bash
npm run build
```

出力は `dist/` ディレクトリに生成されます。

## 新しいコマンドの追加

1. `src/commands/<command-name>.ts` にハンドラーファイルを作成します。
2. `src/index.ts` にコマンドを登録します。
3. 必要に応じて `templates/` にテンプレートを追加します。
4. `tests/` にテストを作成します。

## Lint＆型チェック

```bash
npm run lint   # TypeScript型チェック（tsc --noEmit）
```

## コーディングルール

- **`console.log` 禁止** — CLI出力のフォーマットには `picocolors` を使用します。
- **小さなファイル** — 最大800行、理想的には200〜400行。
- **イミュータブルパターン** — オブジェクト/配列を直接変更しません。
- **名前付きエクスポート** — 内部モジュールでは、デフォルトエクスポートより名前付きエクスポートを優先します。
