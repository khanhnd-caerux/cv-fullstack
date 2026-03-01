---
id: rules-skills
title: ルールとスキル
sidebar_position: 6
description: AIDKのルールとスキルシステムの詳細説明。
---

# ルールとスキル

AIDKはAIをガイドするために**ルール（Rules）**と**スキル（Skills）**という2つの主要なメカニズムを使用します。どちらも `.agent/` ディレクトリに配置されます。

## ルール（Rules）

ルールは `.agent/rules/` 内の `.md` ファイルです。AIは**すべてのタスクの前**にこれらを読み取り、プロジェクトの制約と基準を理解します。

### ルールの構造

```markdown
# ルール名

## 説明
このルールが何を強制するかの簡単な説明。

## 必須ガイドライン
- ルール1
- ルール2

## 正しい例
...

## 間違った例
...
```

### デフォルトルール

| ルール | 優先度 | 説明 |
|-------|--------|------|
| `0-force-rule.md` | 0（最高） | タスク開始前にすべてのルール/スキルをレビューするようAIに強制する |
| `2-dotenv-environments.md` | 2 | `.env` ファイルを使用した環境変数設定基準 |
| `3-coding-style.md` | 3 | コーディングスタイルルール（ファイルサイズ制限、イミュータビリティなど） |

### 優先度の順序

番号が小さいルールが優先されます。例えば、`0-force-rule.md` は常に最初に適用されます。

---

## スキル（Skills）

スキルは `.agent/skills/` 内のディレクトリで、各ディレクトリには少なくとも `SKILL.md` ファイルが含まれます。スキルは**技術またはタスク固有**のガイダンスを提供します。

### スキルの構造

```
.agent/skills/
└── my-skill/
    ├── SKILL.md        # メイン指示（必須）
    ├── examples/       # 参考例（オプション）
    └── templates/      # ファイルテンプレート（オプション）
```

### `SKILL.md` フロントマター

```yaml
---
name: my-skill
description: >
  このスキルをいつ使用するかを説明します。
  AIはこの説明を読んでスキルを適用するかどうかを判断します。
---
```

### 利用可能なスキル

| スキル | 使用するタイミング |
|-------|----------------|
| `cxl-brainstorming` | 創造的/構築的な作業の前 |
| `cxl-fastapi` | FastAPIでのREST API構築 |
| `cxl-docusaurus-setup` | Docusaurusドキュメントサイトの作成/更新 |
| `cxl-terraform` | Terraform/OpenToFuでの作業 |
| `cxl-ansible` | Ansibleプレイブックの作成 |
| `cxl-postgres-patterns` | スキーマ設計とPostgreSQLクエリ |
| `cxl-dynamodb` | DynamoDBデータモデリング |
| `cxl-aws-architecture` | AWSアーキテクチャ設計 |
| `cxl-security-review` | 認証/API追加時のセキュリティレビュー |
| `cxl-python` | Pythonコーディング基準 |
| `cxl-coding-standards` | TypeScript/JavaScript/React基準 |
| `cxl-seo` | SEO最適化 |
| `cxl-gitignore` | `.gitignore` の作成/更新 |
| `cxl-report-po` | 構造化されたPA/DAレポート作成 |

### 新しいスキルの作成

```bash
aidk add skill my-new-skill
# 作成：.agent/skills/my-new-skill/SKILL.md
```

プロジェクトの特定のニーズに応じて `SKILL.md` を編集します。

---

## ワークフロー（Workflows）

ワークフローは `.agent/workflows/` 内の `.md` ファイルで、スラッシュコマンドで呼び出せるプロセスを定義します。

### デフォルトワークフロー

| ワークフロー | スラッシュコマンド | 説明 |
|------------|----------------|------|
| `new-requirement.md` | `/new-requirement` | 要件から計画までのドキュメントを生成 |
| `execute-plan.md` | `/execute-plan` | 機能計画のステップバイステップ実行 |
| `code-review.md` | `/code-review` | プッシュ前のコードレビュー |
| `debug.md` | `/debug` | コード変更前の根本原因分析 |
| `write-tests.md` | `/write-tests` | 新機能のテスト作成 |
| `create-report-po.md` | `/create-report-po` | NotionからPA/DAレポートを作成 |
