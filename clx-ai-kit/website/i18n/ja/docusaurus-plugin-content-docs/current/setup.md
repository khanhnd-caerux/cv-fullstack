---
id: setup
title: インストールとセットアップ
sidebar_position: 2
description: AIDK CLIのインストールとプロジェクト構造の初期化に関するステップバイステップガイド。
---

# インストールとセットアップ

## システム要件

- **Node.js** >= 24
- **npm** >= 10

## グローバルインストール

```bash
npm install -g @caeruxlab/aidk
```

CaeruxLab GitLabレジストリを使用する場合は、先に `.npmrc` を設定してください：

1.  **個人アクセストークン (PAT) の生成:**
    *   GitLabアカウントにログインします。
    *   **User Settings** (ユーザーのアバターをクリック) -> **Access Tokens** に移動します。
    *   トークン名（例: "AIDK"）を入力します。
    *   **Scopes** (または **Permissions**) セクションで、**`api`** チェックボックスを選択します。
    *   ページ下部の "Create personal access token" をクリックします。
    *   生成されたトークンをコピーします。

2.  **`.npmrc` の設定:**

    `~/.npmrc` またはプロジェクトレベルの `.npmrc` に以下の内容を追加し、`YOUR_GITLAB_TOKEN` を生成したトークンに置き換えます：

```bash
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/
//git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/:_authToken=YOUR_GITLAB_TOKEN
```

次にインストール：

```bash
npm install -g @caeruxlab/aidk
```

## インストール確認

```bash
aidk --version
```

## プロジェクトの初期化

プロジェクトのルートディレクトリで実行します：

```bash
aidk init
```

これにより：
1. rules、skills、workflowsの構造を持つ `.agent/` ディレクトリが作成されます。
2. ドキュメントテンプレートを持つ `docs/ai/` ディレクトリが作成されます。
3. `.ai-devkit.json` 設定ファイルが作成されます。

## 初期化後のプロジェクト構造

```
your-project/
├── .agent/
│   ├── rules/          # AIガイダンスルール
│   ├── skills/         # 専門的なAIスキル
│   └── workflows/      # スラッシュコマンドワークフロー
├── docs/
│   └── ai/
│       ├── requirements/
│       ├── design/
│       ├── planning/
│       ├── implementation/
│       └── testing/
└── .ai-devkit.json
```

## `.ai-devkit.json` の設定

このファイルはプロジェクトレベルのAIDK設定を保存します：

```json
{
  "version": "1.0.0",
  "cliVersion": "0.1.0",
  "environments": ["cursor", "antigravity", "claude-code"]
}
```

| フィールド | 説明 |
|-----------|------|
| `version` | 設定バージョン |
| `cliVersion` | AIDK CLIバージョン |
| `environments` | 対象環境（`cursor`、`antigravity`、`claude-code`） |
