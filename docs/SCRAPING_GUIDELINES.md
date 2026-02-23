# スクレイピングガイドライン

本ドキュメントでは、ウマ娘チケットポータルのスクレイパー開発における倫理的・技術的ガイドラインを定めます。

## 🚦 基本原則

### ✅ 許可される行為

1. **URLの収集・表示**
   - イベントページへのリンク収集
   - チケット販売サイトへのリンク収集
   - 公式プレスリリースへのリンク収集

2. **テキスト情報の取得**
   - イベント名
   - 開催日時
   - 会場情報
   - チケット販売期間

3. **構造化データの活用**
   - JSON-LD
   - Open Graph メタデータ
   - サイトマップ (sitemap.xml)

### ❌ 禁止される行為

1. **画像の直接転載**
   - 公式画像をダウンロードしてサーバーに保存しない
   - 代わりに公式サイトへのリンクを使用

2. **過度なアクセス**
   - 短時間での連続リクエスト
   - 並列での大量リクエスト

3. **robots.txt違反**
   - Disallowで指定されたパスへのアクセス
   - クロール禁止指示の無視

4. **認証が必要なページへのアクセス**
   - ログイン必須コンテンツ
   - 会員限定情報

## 📋 robots.txt 確認結果

### umamusume.jp (2026年2月確認)

```
User-agent: *
Sitemap: https://umamusume.jp/sitemap_index.xml
```

**解釈:**
- 全てのUser-agentに対して特別な制限なし
- サイトマップが提供されている
- 一般的なクロールは許可されている

### 定期確認

robots.txtは変更される可能性があるため、以下のタイミングで再確認すること：

- [ ] スクレイパーの初回開発時
- [ ] 月次メンテナンス時
- [ ] エラーが頻発した場合

## ⏱ アクセス間隔の設定

### 必須ルール

```python
import time

CRAWL_DELAY = 1.5  # 最低1秒、余裕を持って1.5秒

def fetch_page(url):
    response = requests.get(url, headers=HEADERS)
    time.sleep(CRAWL_DELAY)  # 次のリクエストまで待機
    return response
```

### 推奨設定

| 対象サイト | 推奨間隔 | 理由 |
|------------|----------|------|
| umamusume.jp | 1.5秒 | 公式サイト、負荷配慮 |
| Cygamesプレスリリース | 2.0秒 | 企業サイト |
| チケットサイト (参照のみ) | - | URLのみ保存、クロールしない |

## 🤖 User-Agent の設定

### 推奨 User-Agent

```python
HEADERS = {
    'User-Agent': 'UmaTicketPortal/1.0 (Educational Project; +https://github.com/your-username/uma_ticket)',
}
```

**ポイント:**
- ボット名を明記
- 連絡先または情報ページへのリンクを含める
- 悪意がないことを示す

### ❌ 避けるべき User-Agent

```python
# NG: ブラウザを偽装
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...'
```

## 🔄 エラーハンドリング

### ステータスコード別対応

| コード | 意味 | 対応 |
|--------|------|------|
| 200 | 成功 | 通常処理 |
| 403 | Forbidden | クロール中止、設定見直し |
| 404 | Not Found | スキップ、ログ記録 |
| 429 | Too Many Requests | 長時間待機後にリトライ |
| 503 | Service Unavailable | 時間をおいてリトライ |

### リトライ戦略

```python
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

retry_strategy = Retry(
    total=3,
    backoff_factor=2,  # 2秒, 4秒, 8秒と増加
    status_forcelist=[429, 500, 502, 503, 504],
)
```

## 📊 収集するデータ

### イベント情報

```json
{
  "title": "ウマ娘 5th EVENT ARENA TOUR",
  "event_date": "2026-03-15T18:00:00+09:00",
  "venue": "さいたまスーパーアリーナ",
  "source_url": "https://umamusume.jp/news/xxxxx",
  "scraped_at": "2026-02-23T10:00:00+09:00"
}
```

### チケット情報

```json
{
  "platform": "e+",
  "url": "https://eplus.jp/xxxxx",
  "sale_start": "2026-02-01T10:00:00+09:00",
  "sale_end": "2026-03-01T23:59:59+09:00",
  "status": "on_sale"
}
```

## 📁 対象サイト一覧

### クロール対象

| サイト | URL | 目的 |
|--------|-----|------|
| ウマ娘公式 | https://umamusume.jp/ | イベント情報 |
| Cygamesプレスリリース | https://www.cygames.co.jp/press/ | 公式発表 |

### リンク収集のみ (クロールしない)

| サイト | URL | 備考 |
|--------|-----|------|
| e+ (イープラス) | https://eplus.jp/ | チケット販売リンクのみ |
| ローソンチケット | https://l-tike.com/ | チケット販売リンクのみ |
| Zaiko | https://zaiko.io/ | チケット販売リンクのみ |

## ✅ チェックリスト

スクレイパー開発前に確認：

- [ ] robots.txt を確認した
- [ ] アクセス間隔を1秒以上に設定した
- [ ] 適切なUser-Agentを設定した
- [ ] 画像の直接保存をしていない
- [ ] エラーハンドリングを実装した
- [ ] ログ機能を実装した

## 📚 参考資料

- [Robots Exclusion Protocol](https://www.robotstxt.org/)
- [Webスクレイピングの法的整理](https://www.soumu.go.jp/)
- [Ethical Web Scraping](https://www.scrapingbee.com/blog/web-scraping-ethics/)
