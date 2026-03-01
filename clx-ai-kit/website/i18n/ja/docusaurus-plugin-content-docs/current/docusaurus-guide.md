---
sidebar_position: 9
id: docusaurus-guide
---

# プロジェクトドキュメントガイド

AIDKのドキュメントは [Docusaurus v3](https://docusaurus.io/) を使用して構築されています。このガイドでは、コントリビューターが開発環境をセットアップし、新しいページを作成し、ドキュメントの多言語対応（i18n）を管理する方法について説明します。

## 1. ローカル開発環境のセットアップ

ドキュメントサイトのすべてのソースコードは `website/` ディレクトリにあります。

```bash
cd website
npm install
```

### 開発用サーバーの実行

Docusaurusはライブリロードをサポートしています。言語ごとに実行してテストすることができます：

```bash
# ベトナム語（デフォルト言語）を実行 http://localhost:3000
npm start

# 英語を実行 http://localhost:3000/en/
npm start -- --locale en

# 日本語を実行 http://localhost:3000/ja/
npm start -- --locale ja
```

## 2. 新しいページの追加

ベトナム語がこのプロジェクトのデフォルト言語（信頼できる唯一の情報源）です。新しいページはすべて、まずベトナム語で作成する必要があります。

1. `website/docs/` ディレクトリ内に新しいMarkdown（`.md`）ファイルを作成します。
2. ファイルの先頭には、必ず **IDとPositionのFrontmatter** ブロックを含める必要があります：

```markdown
---
sidebar_position: 10
id: my-new-guide
---

# ドキュメントのタイトル
ドキュメントの本文はここから始まります。
```

## 3. 多言語対応（i18n）の管理

ベトナム語のソースドキュメントが完成したら、英語と日本語の翻訳を提供する必要があります。

### ディレクトリ構造のコピー

翻訳されたMarkdownコンテンツは、`website/i18n/{locale}/docusaurus-plugin-content-docs/current/` に保存されます。

```bash
# 新しいガイドを作成したと仮定して、翻訳フォルダにコピーします
cp website/docs/my-new-guide.md website/i18n/en/docusaurus-plugin-content-docs/current/
cp website/docs/my-new-guide.md website/i18n/ja/docusaurus-plugin-content-docs/current/
```

**重要な注意**: 翻訳ファイルのFrontmatter（`sidebar_position` と `id`）は、ベトナム語のソースと**完全に同じである必要があります**。Frontmatterブロックの下にあるコンテンツのみを翻訳してください。

### サイドバーとナビゲーションバーのラベルの更新

ドロップダウンメニューを追加したり、サイドバー（`sidebars.ts`）でカテゴリの名前を変更したりした場合は、それらのラベルの翻訳を提供する必要があります。翻訳キーを推測する代わりに、次の自動コマンドを使用してください：

```bash
cd website
npm run docusaurus write-translations -- --locale en
npm run docusaurus write-translations -- --locale ja
```

このコマンドは設定ファイルを解析し、必要なJSONキーの枠組みを `i18n/{locale}/` ディレクトリに出力します。`current.json`（サイドバー用）と `navbar.json` を開いて、`message` プロパティを翻訳してください。

## 4. ビルドとCI/CD

コードを `main` ブランチにプッシュする前に、ローカルで本番環境のビルドを実行してリンク切れ（broken links）がないか確認してください。Docusaurusはリンク切れに対して非常に厳格です。

```bash
npm run build
```

コマンドが `[SUCCESS] Generated static files` と出力すれば、コミットしても安全です。`main` にプッシュされると、GitLab CI/CDシステム（`pages` ジョブ）が自動的に `build/` の出力を取得し、プロジェクトのGitLab Pages URLにデプロイします。
