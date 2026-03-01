---
id: publishing
title: パッケージの公開
sidebar_position: 7
description: AIDKパッケージをGitLab Package Registryに公開するためのガイド。
---

# パッケージの公開

AIDKはpublic npmレジストリではなく**GitLab Package Registry**に公開されます。完全なプロセスを以下に説明します。

## 前提条件

1. GitLabプロジェクトで `Maintainer` または `Owner` ロールのメンバーである必要があります。
2. `api` または `write_registry` スコープを持つ**Personal Access Token**（PAT）が必要です。
3. `.npmrc` ファイルが正しく設定されている必要があります。

## ステップ1：`.npmrc` の設定

プロジェクトルートに `.npmrc` を作成または更新します：

```ini
@caeruxlab:registry=https://git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/
//git.caerux.com/api/v4/projects/caeruxlab%2Fclx-ai-kit/packages/npm/:_authToken=${NPM_TOKEN}
```

:::caution
実際のトークンを `.npmrc` にコミットしないでください。`NPM_TOKEN` 環境変数を使用してください。
:::

## ステップ2：環境変数の設定

```bash
export NPM_TOKEN=your-personal-access-token
```

## ステップ3：公開前のビルド

```bash
npm run build
```

`dist/` ディレクトリのビルド出力を確認します。

## ステップ4：バージョンの更新

[セマンティックバージョニング](https://semver.org) に従って `npm version` で `package.json` を更新します：

```bash
# パッチ（0.2.0 -> 0.2.1）
npm version patch

# マイナー（0.2.0 -> 0.3.0）
npm version minor

# メジャー（0.2.0 -> 1.0.0）
npm version major
```

## ステップ5：公開

```bash
npm publish
```

`package.json` の `prepublishOnly` スクリプトが公開前に自動的に `npm run build` を実行します。

## GitLab CI/CDによる自動公開

上記の手動プロセスは例外的なケースのためのものです。通常、公開は新しいタグが `main` にプッシュされたときに**GitLab CI/CDを通じて自動的に**行われます。

詳細は **[GitLabセットアップ](./gitlab-setup.md)** を参照してください。

## 公開後の確認

公開後、パッケージが以下の場所に表示されることを確認します：
- GitLab UI：**Project → Deploy → Package Registry**
- またはインストールを試みる：`npm install -g @caeruxlab/aidk@<version>`

## CHANGELOGの更新

新しいバージョンの変更を記録するために、公開前に常に `CHANGELOG.md` を更新してください。
