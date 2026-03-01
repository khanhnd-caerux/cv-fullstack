---
id: examples
title: 使用例
sidebar_position: 4
description: プロジェクトでAIDKを使用する実際の例。
---

# 使用例

## 例1：FastAPI + Next.jsプロジェクトの初期化

FastAPI（バックエンド）とNext.js（フロントエンド）の新しいフルスタックプロジェクトがあるとします。

```bash
# ステップ1：AIDK構造を初期化
cd my-fullstack-project
aidk init

# ステップ2：FastAPIスキルを追加
aidk add skill fastapi

# ステップ3：PostgreSQLパターンスキルを追加
aidk add skill postgres-patterns
```

IDEのAIは自動的にこれらのスキルを読み取り、FastAPIとPostgreSQLのベストプラクティスを適用します。

## 例2：新機能の要件ドキュメント作成

`/new-requirement` ワークフローを使用して、要件から実装計画まで完全なドキュメントを生成します：

```
@[/new-requirement] user-authentication
```

AIは以下の手順でガイドします：
1. 解決すべき問題の説明
2. ユーザーとユースケースの定義
3. 成功基準の設定
4. `docs/ai/` 配下への完全なドキュメントファイル生成

## 例3：プッシュ前のコードレビュー

```
@[/code-review]
```

AIは次の処理を行います：
- 実装を設計ドキュメントと比較
- 定義されたルールに対してコーディングスタイルを検証
- 対応が必要な問題を報告

## 例4：複雑な問題のデバッグ

```
@[/debug] 新しいユーザー作成時にAPIが500を返す
```

AIはコードの変更を提案する前に、構造化された根本原因分析を実行します。

## 例5：実装計画の実行

`/new-requirement` でプランニングドキュメントを作成した後、実装を開始します：

```
@[/execute-plan] user-authentication
```

AIは `docs/ai/planning/feature-user-authentication.md` を読み取り、制御された方法でタスクを一つずつ実行します。
