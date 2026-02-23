# 🏇 ウマ娘チケットポータル

<p align="center">
  <img src="docs/images/logo.png" alt="ウマ娘チケットポータル" width="200">
</p>

<p align="center">
  <strong>ウマ娘関連イベント・ライブのチケット情報を一覧表示するWebポータル</strong>
</p>

<p align="center">
  <a href="#features">機能</a> •
  <a href="#tech-stack">技術スタック</a> •
  <a href="#getting-started">セットアップ</a> •
  <a href="#architecture">アーキテクチャ</a> •
  <a href="#roadmap">ロードマップ</a>
</p>

---

## 📖 概要

「ウマ娘チケットポータル」は、Cygamesの人気コンテンツ「ウマ娘 プリティーダービー」に関連するライブ・イベント情報を自動収集し、チケット購入リンクと共に一覧表示するWebポータルサイトです。

ファンが複数のサイトを巡回することなく、最新のイベント情報とチケット販売状況を一目で確認できることを目指しています。

## ✨ Features

- 🔍 **自動情報収集** - ウマ娘公式サイト・Cygamesプレスリリースを定期クロール
- 🎫 **チケットリンク集約** - e+, ローソンチケット, Zaiko等の販売サイトURLを一元管理
- 📅 **カード形式表示** - 開催日・販売期間・残り日数を視覚的に表示
- 🎨 **ウマ娘らしいUI** - レース・ターフをイメージしたデザイン
- 📱 **レスポンシブ対応** - PC・スマートフォン両対応

## 🛠 Tech Stack

### フロントエンド
| 技術 | 用途 |
|------|------|
| [Next.js 14](https://nextjs.org/) (App Router) | Reactフレームワーク |
| [Tailwind CSS](https://tailwindcss.com/) | スタイリング |
| [TypeScript](https://www.typescriptlang.org/) | 型安全な開発 |

### バックエンド・データ
| 技術 | 用途 |
|------|------|
| [Supabase](https://supabase.com/) | データベース (PostgreSQL) |
| [Python](https://www.python.org/) / Node.js | Webスクレイパー |

### インフラ・CI/CD
| 技術 | 用途 |
|------|------|
| [Vercel](https://vercel.com/) | フロントエンドデプロイ |
| [GitHub Actions](https://github.com/features/actions) | 定期クロール実行 (cron) |

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Actions                          │
│                    (毎日定期実行 cron)                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      Scraper                                 │
│           (Python / Node.js スクレイパー)                    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ 公式サイト    │  │ プレスリリース │  │ チケットサイト │       │
│  │ クローラー    │  │ クローラー    │  │ リンク収集    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                                │
│                   (PostgreSQL データベース)                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   events     │  │   tickets    │  │   sources    │       │
│  │  (イベント)   │  │  (チケット)   │  │  (情報元)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js (Vercel)                          │
│                      フロントエンド                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  イベント一覧  │  │  イベント詳細  │  │  チケットリンク │       │
│  │    ページ    │  │    ページ    │  │    表示      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
uma_ticket/
├── frontend/                     # Next.js フロントエンド ✅
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css       # グローバルスタイル
│   │   │   ├── layout.tsx        # 共通レイアウト
│   │   │   └── page.tsx          # トップページ
│   │   ├── components/
│   │   │   ├── EventCard.tsx     # イベントカード
│   │   │   ├── TicketLink.tsx    # チケットリンク
│   │   │   ├── Header.tsx        # ヘッダー
│   │   │   ├── Footer.tsx        # フッター
│   │   │   ├── EventCardSkeleton.tsx  # ローディング
│   │   │   └── index.ts          # エクスポート
│   │   ├── lib/
│   │   │   ├── supabase.ts       # Supabaseクライアント
│   │   │   └── utils.ts          # ユーティリティ
│   │   └── types/
│   │       ├── database.ts       # DB型定義
│   │       └── index.ts          # 定数・型エクスポート
│   ├── .env.local                # 環境変数
│   └── package.json
│
├── scraper/                      # スクレイパー 🔜 (未実装)
│   ├── src/
│   │   ├── crawlers/             # 各サイト用クローラー
│   │   └── utils/                # 共通ユーティリティ
│   └── requirements.txt          # Python依存関係
│
├── supabase/                     # データベース ✅
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # 初期スキーマ
│   └── seed.sql                  # テストデータ
│
├── .github/
│   └── workflows/                # GitHub Actions 🔜 (未実装)
│       └── scrape.yml            # 定期クロール設定
│
├── docs/                         # ドキュメント ✅
│   ├── SCRAPING_GUIDELINES.md    # スクレイピングガイドライン
│   ├── SUPABASE_SETUP.md         # Supabaseセットアップ手順
│   └── images/                   # 画像ファイル
│
├── .env.example                  # 環境変数テンプレート
├── .gitignore
├── LICENSE
└── README.md
```

**凡例:** ✅ 実装済み | 🔜 次に実装 | 未マーク = 未実装

## 🚀 Getting Started

### 前提条件

- Node.js 18以上
- Python 3.10以上 (スクレイパー用)
- npm または yarn
- Supabaseアカウント

### インストール

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/your-username/uma_ticket.git
   cd uma_ticket
   ```

2. **フロントエンドのセットアップ**
   ```bash
   cd frontend
   npm install
   ```

3. **スクレイパーのセットアップ**
   ```bash
   cd scraper
   pip install -r requirements.txt
   ```

4. **環境変数の設定**
   ```bash
   cp .env.example .env.local
   ```
   
   `.env.local` に以下を設定:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

5. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

## 🗃 Database Schema

### events テーブル
| カラム | 型 | 説明 |
|--------|------|------|
| id | uuid | 主キー |
| title | text | イベント名 |
| description | text | 説明 |
| event_date | timestamp | 開催日時 |
| venue | text | 会場 |
| image_url | text | イメージ画像URL |
| source_url | text | 情報元URL |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

### tickets テーブル
| カラム | 型 | 説明 |
|--------|------|------|
| id | uuid | 主キー |
| event_id | uuid | イベントID (外部キー) |
| platform | text | 販売プラットフォーム名 |
| url | text | チケット購入URL |
| sale_start | timestamp | 販売開始日時 |
| sale_end | timestamp | 販売終了日時 |
| status | text | 販売状況 |
| created_at | timestamp | 作成日時 |

## 📅 Roadmap

### ✅ 完了したステップ

#### Step 1: プロジェクト設計・README作成 ✅
- [x] README.md 作成（概要、技術スタック、アーキテクチャ図）
- [x] LICENSE (MIT) 作成
- [x] .gitignore 設定
- [x] .env.example 作成
- [x] スクレイピングガイドライン作成 (`docs/SCRAPING_GUIDELINES.md`)
- [x] robots.txt 確認・ポリシー策定

#### Step 2: データベース設計・Supabase準備 ✅
- [x] DBスキーマ設計 (`supabase/migrations/001_initial_schema.sql`)
- [x] テーブル作成: events, tickets, ticket_platforms, scrape_logs
- [x] RLS (Row Level Security) ポリシー設定
- [x] ビュー作成: active_events_with_tickets
- [x] テストデータ作成 (`supabase/seed.sql`)
- [x] Supabaseセットアップガイド作成 (`docs/SUPABASE_SETUP.md`)

#### Step 3: フロントエンド基盤構築 ✅
- [x] Next.js 16 プロジェクト作成 (App Router, TypeScript, Tailwind CSS)
- [x] Supabaseクライアント設定 (`src/lib/supabase.ts`)
- [x] 型定義作成 (`src/types/database.ts`)
- [x] UIコンポーネント作成
  - [x] Header / Footer
  - [x] EventCard（イベントカード）
  - [x] TicketLink（チケットリンク）
  - [x] EventCardSkeleton（ローディング）
- [x] トップページ実装（モックデータ対応）
- [x] ユーティリティ関数（日付フォーマット、残り日数計算）

---

### 🚧 これから実施するステップ

#### Step 4: スクレイパー開発 🔜 **次のステップ**
```
scraper/
├── src/
│   ├── main.py              # エントリーポイント
│   ├── crawlers/
│   │   ├── umamusume.py     # ウマ娘公式サイトクローラー
│   │   └── cygames.py       # Cygamesプレスリリースクローラー
│   ├── db/
│   │   └── supabase.py      # Supabase操作
│   └── utils/
│       ├── http.py          # HTTPリクエスト (間隔制御)
│       └── parser.py        # HTMLパーサー
├── requirements.txt
└── .env.example
```

**実装内容:**
- [ ] Python環境セットアップ
- [ ] HTTPリクエスト関数（1.5秒間隔、リトライ機能）
- [ ] ウマ娘公式サイト（https://umamusume.jp/news/）クローラー
- [ ] イベント情報パーサー
- [ ] Supabaseへのデータ保存処理
- [ ] ログ機能実装
- [ ] ローカルテスト

#### Step 5: フロントエンド完成
- [ ] Supabase接続テスト（実データ表示）
- [ ] イベント詳細ページ (`/events/[id]`)
- [ ] フィルタリング機能（イベントタイプ別）
- [ ] 検索機能
- [ ] ページネーション
- [ ] デザイン調整・アニメーション
- [ ] メタタグ・OGP設定
- [ ] エラーハンドリング改善

#### Step 6: GitHub Actions設定
```yaml
# .github/workflows/scrape.yml
name: Daily Scrape
on:
  schedule:
    - cron: '0 0 * * *'  # 毎日 UTC 0:00 (JST 9:00)
  workflow_dispatch:      # 手動実行も可能
```

**実装内容:**
- [ ] ワークフロー作成
- [ ] Secrets設定 (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Python環境セットアップステップ
- [ ] スクレイパー実行ステップ
- [ ] 実行結果通知（オプション）

#### Step 7: Vercelデプロイ
- [ ] Vercelプロジェクト作成
- [ ] 環境変数設定
- [ ] ドメイン設定（オプション）
- [ ] 本番デプロイ
- [ ] 動作確認

#### Step 8: 機能拡張・改善（オプション）
- [ ] プッシュ通知（新イベント追加時）
- [ ] カレンダー連携
- [ ] Twitter/X 連携
- [ ] ダークモード対応
- [ ] PWA対応
- [ ] パフォーマンス最適化

---

### 📊 現在の進捗状況

```
[██████████████████░░░░░░░░░░░░] 40% 完了

Step 1 ████████ 完了
Step 2 ████████ 完了  
Step 3 ████████ 完了
Step 4 ░░░░░░░░ 次のステップ
Step 5 ░░░░░░░░ 
Step 6 ░░░░░░░░
Step 7 ░░░░░░░░
Step 8 ░░░░░░░░ オプション
```

### 🎯 MVP (最小限の動作) に必要なステップ
1. ~~Step 1: README作成~~ ✅
2. ~~Step 2: DB設計~~ ✅
3. ~~Step 3: フロントエンド基盤~~ ✅
4. **Step 4: スクレイパー** 🔜
5. Step 5: フロントエンド完成
6. Step 6: 自動化
7. Step 7: デプロイ

## ⚠️ 注意事項

### スクレイピングポリシー

本プロジェクトでは、Webスクレイピングに関する倫理的ガイドラインを厳守しています。

| 項目 | 対応 | 説明 |
|------|:----:|------|
| サイトURLの収集 | ✅ | イベントページへのリンクを収集・表示 |
| 公式画像の転載 | ❌ | 画像は直接転載せず、公式サイトへのリンクで対応 |
| アクセス間隔 | ✅ | **1秒以上**の間隔を空けてリクエスト |
| robots.txt遵守 | ✅ | 禁止されたページへのアクセスは行わない |

#### robots.txt 確認結果 (2026年2月時点)

```
# https://umamusume.jp/robots.txt
User-agent: *
Sitemap: https://umamusume.jp/sitemap_index.xml
```

- `Disallow` 指定なし → 一般的なページへのアクセスは許可
- サイトマップが提供されているため、構造に沿った収集が可能

### 法的事項
- 本プロジェクトは個人の学習・ポートフォリオ目的で作成されています
- 「ウマ娘 プリティーダービー」はCygames, Inc.の登録商標です
- 本プロジェクトはCygames, Inc.とは一切関係がありません

### 免責事項
- 表示されるイベント情報・チケット情報は公式サイトから自動収集したものであり、正確性を保証するものではありません
- チケット購入の際は必ず公式サイトで最新情報をご確認ください

## 📄 License

MIT License - 詳細は [LICENSE](LICENSE) を参照してください。

## 🤝 Contributing

プルリクエストは歓迎します！大きな変更を加える場合は、まずissueを開いて議論してください。

---

<p align="center">
  Made with ❤️ for ウマ娘ファン
</p>
