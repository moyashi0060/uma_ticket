# Supabase セットアップガイド

このドキュメントでは、ウマ娘チケットポータル用のSupabaseプロジェクトのセットアップ手順を説明します。

## 📋 前提条件

- Supabaseアカウント（無料プランでOK）
- GitHubアカウント（Supabaseログイン用）

## 🚀 セットアップ手順

### Step 1: Supabaseプロジェクトの作成

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. 「New Project」をクリック
3. 以下の情報を入力:
   - **Name**: `uma-ticket-portal`
   - **Database Password**: 強力なパスワードを設定（後で使用）
   - **Region**: `Northeast Asia (Tokyo)` を選択
4. 「Create new project」をクリック
5. プロジェクトの作成完了まで数分待機

### Step 2: APIキーの取得

1. プロジェクトダッシュボードで「Settings」→「API」を開く
2. 以下のキーをメモ:

   | キー | 用途 |
   |------|------|
   | **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
   | **anon public** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` (フロントエンド用) |
   | **service_role** | `SUPABASE_SERVICE_ROLE_KEY` (スクレイパー用、秘密) |

   ⚠️ **service_role キーは絶対に公開しないでください！**

### Step 3: データベーススキーマの作成

1. Supabaseダッシュボードで「SQL Editor」を開く
2. 「New query」をクリック
3. `supabase/migrations/001_initial_schema.sql` の内容をコピー＆ペースト
4. 「Run」をクリックして実行
5. 「Success. No rows returned」と表示されれば完了

### Step 4: スキーマの確認

「Table Editor」で以下のテーブルが作成されていることを確認:

- ✅ `events` - イベント情報
- ✅ `tickets` - チケット情報
- ✅ `ticket_platforms` - プラットフォームマスタ
- ✅ `scrape_logs` - スクレイピングログ

「ticket_platforms」テーブルには初期データ（e+, ローソンチケット等）が入っています。

### Step 5: 環境変数の設定

#### ローカル開発用

プロジェクトルートに `.env.local` を作成:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# スクレイパー用（ローカルテスト時のみ）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### GitHub Actions用

リポジトリの Settings → Secrets and variables → Actions で以下を設定:

| Secret名 | 値 |
|----------|-----|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role キー |

## 📊 データベース構造

### ER図

```
┌─────────────────────┐       ┌─────────────────────┐
│       events        │       │   ticket_platforms  │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ title               │       │ name                │
│ description         │       │ display_name        │
│ event_date          │       │ base_url            │
│ event_end_date      │       │ icon_url            │
│ venue               │       └──────────┬──────────┘
│ image_url           │                  │
│ source_url (UNIQUE) │                  │
│ event_type          │                  │
│ is_active           │                  │
│ created_at          │                  │
│ updated_at          │                  │
└──────────┬──────────┘                  │
           │                             │
           │ 1:N                         │ 1:N
           │                             │
           ▼                             │
┌─────────────────────────────────────────┘
│         tickets           │
├───────────────────────────┤
│ id (PK)                   │
│ event_id (FK → events)    │
│ platform_id (FK → platforms)
│ ticket_url                │
│ ticket_type               │
│ sale_start                │
│ sale_end                  │
│ status                    │
│ price_info                │
│ notes                     │
│ created_at                │
│ updated_at                │
└───────────────────────────┘

┌───────────────────────────┐
│       scrape_logs         │
├───────────────────────────┤
│ id (PK)                   │
│ source_name               │
│ source_url                │
│ status                    │
│ events_found              │
│ events_added              │
│ events_updated            │
│ error_message             │
│ started_at                │
│ finished_at               │
└───────────────────────────┘
```

### テーブル詳細

#### events (イベント情報)

| カラム | 型 | 説明 |
|--------|------|------|
| id | UUID | 主キー |
| title | TEXT | イベント名 |
| description | TEXT | 説明 |
| event_date | TIMESTAMPTZ | 開催日時 |
| event_end_date | TIMESTAMPTZ | 終了日時 |
| venue | TEXT | 会場 |
| image_url | TEXT | イメージ画像URL（外部リンク） |
| source_url | TEXT | 情報元URL（ユニーク） |
| event_type | TEXT | live / fanmeeting / exhibition / other |
| is_active | BOOLEAN | 表示フラグ |

#### tickets (チケット情報)

| カラム | 型 | 説明 |
|--------|------|------|
| id | UUID | 主キー |
| event_id | UUID | イベントID（外部キー） |
| platform_id | UUID | プラットフォームID（外部キー） |
| ticket_url | TEXT | チケット購入URL |
| ticket_type | TEXT | general / premium / lottery / resale |
| sale_start | TIMESTAMPTZ | 販売開始日時 |
| sale_end | TIMESTAMPTZ | 販売終了日時 |
| status | TEXT | upcoming / on_sale / sold_out / ended / unknown |
| price_info | TEXT | 価格情報 |

## 🔒 セキュリティ設定

### Row Level Security (RLS)

本スキーマでは以下のRLSポリシーを設定:

- **読み取り**: 全ユーザーが可能（公開データのため）
- **書き込み**: service_role キーを持つスクレイパーのみ

### API呼び出し

```typescript
// フロントエンド（読み取り専用）
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// イベント一覧取得
const { data, error } = await supabase
  .from('active_events_with_tickets')
  .select('*')
```

```python
# スクレイパー（書き込み可能）
from supabase import create_client

supabase = create_client(
    os.environ['SUPABASE_URL'],
    os.environ['SUPABASE_SERVICE_ROLE_KEY']
)

# イベント追加
supabase.table('events').insert({
    'title': 'ウマ娘 5th EVENT',
    'event_date': '2026-03-15T18:00:00+09:00',
    'source_url': 'https://umamusume.jp/news/xxxxx'
}).execute()
```

## ✅ チェックリスト

- [ ] Supabaseプロジェクトを作成した
- [ ] APIキーを取得した
- [ ] SQLスキーマを実行した
- [ ] テーブルが正しく作成されたことを確認した
- [ ] `.env.local` を作成した
- [ ] GitHub Secretsを設定した（デプロイ時）

## 🆘 トラブルシューティング

### Q: SQLエラーが発生する

- Supabaseの「SQL Editor」で実行していることを確認
- すでにテーブルが存在する場合は、先に削除するか、`DROP TABLE IF EXISTS` を追加

### Q: RLSでデータが取得できない

- `anon` キーでアクセスしている場合、SELECTポリシーが設定されているか確認
- ビュー `active_events_with_tickets` は RLS を継承するため、元テーブルのポリシーを確認

### Q: スクレイパーからの書き込みが失敗する

- `service_role` キーを使用しているか確認
- キーが正しくコピーされているか確認
