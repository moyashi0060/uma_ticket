-- =============================================
-- テストデータ挿入スクリプト
-- 開発・動作確認用
-- =============================================

-- イベントのサンプルデータ
INSERT INTO events (title, description, event_date, event_end_date, venue, source_url, event_type) VALUES
(
    'ウマ娘 プリティーダービー 5th EVENT ARENA TOUR',
    'ウマ娘 プリティーダービーの5周年を記念したアリーナツアー。豪華キャスト陣によるライブパフォーマンスをお届けします。',
    '2026-03-15 18:00:00+09',
    '2026-03-15 21:00:00+09',
    'さいたまスーパーアリーナ',
    'https://umamusume.jp/news/detail/sample001',
    'live'
),
(
    'ウマ娘 プリティーダービー ファンミーティング 2026春',
    'キャスト陣とファンが直接交流できるファンミーティングイベント。トークショーやミニゲームを予定。',
    '2026-04-20 14:00:00+09',
    '2026-04-20 17:00:00+09',
    'パシフィコ横浜',
    'https://umamusume.jp/news/detail/sample002',
    'fanmeeting'
),
(
    'ウマ娘 プリティーダービー展 〜夢への一歩〜',
    'ウマ娘の世界観を体験できる展示イベント。原画や衣装の展示、フォトスポットなど。',
    '2026-05-01 10:00:00+09',
    '2026-05-31 18:00:00+09',
    '東京ドームシティ Gallery AaMo',
    'https://umamusume.jp/news/detail/sample003',
    'exhibition'
);

-- チケットのサンプルデータ
INSERT INTO tickets (event_id, platform_id, ticket_url, ticket_type, sale_start, sale_end, status, price_info)
SELECT 
    e.id,
    (SELECT id FROM ticket_platforms WHERE name = 'eplus'),
    'https://eplus.jp/uma5th-saitama/',
    'lottery',
    '2026-02-01 10:00:00+09',
    '2026-02-15 23:59:59+09',
    'ended',
    '全席指定 ¥9,800（税込）'
FROM events e WHERE e.source_url = 'https://umamusume.jp/news/detail/sample001';

INSERT INTO tickets (event_id, platform_id, ticket_url, ticket_type, sale_start, sale_end, status, price_info)
SELECT 
    e.id,
    (SELECT id FROM ticket_platforms WHERE name = 'eplus'),
    'https://eplus.jp/uma5th-saitama-general/',
    'general',
    '2026-02-20 10:00:00+09',
    '2026-03-10 23:59:59+09',
    'on_sale',
    '全席指定 ¥9,800（税込）'
FROM events e WHERE e.source_url = 'https://umamusume.jp/news/detail/sample001';

INSERT INTO tickets (event_id, platform_id, ticket_url, ticket_type, sale_start, sale_end, status, price_info)
SELECT 
    e.id,
    (SELECT id FROM ticket_platforms WHERE name = 'lawson'),
    'https://l-tike.com/uma5th/',
    'general',
    '2026-02-20 12:00:00+09',
    '2026-03-10 23:59:59+09',
    'on_sale',
    '全席指定 ¥9,800（税込）'
FROM events e WHERE e.source_url = 'https://umamusume.jp/news/detail/sample001';

-- ファンミーティング用チケット
INSERT INTO tickets (event_id, platform_id, ticket_url, ticket_type, sale_start, sale_end, status, price_info)
SELECT 
    e.id,
    (SELECT id FROM ticket_platforms WHERE name = 'eplus'),
    'https://eplus.jp/uma-fanmeet-2026spring/',
    'lottery',
    '2026-03-01 10:00:00+09',
    '2026-03-15 23:59:59+09',
    'upcoming',
    '一般 ¥5,500 / プレミアム ¥8,800（税込）'
FROM events e WHERE e.source_url = 'https://umamusume.jp/news/detail/sample002';

-- 展示会用チケット
INSERT INTO tickets (event_id, platform_id, ticket_url, ticket_type, sale_start, sale_end, status, price_info)
SELECT 
    e.id,
    (SELECT id FROM ticket_platforms WHERE name = 'lawson'),
    'https://l-tike.com/uma-exhibition/',
    'general',
    '2026-04-01 10:00:00+09',
    '2026-05-30 23:59:59+09',
    'upcoming',
    '一般 ¥2,000 / 中高生 ¥1,500 / 小学生 ¥800（税込）'
FROM events e WHERE e.source_url = 'https://umamusume.jp/news/detail/sample003';

-- スクレイピングログのサンプル
INSERT INTO scrape_logs (source_name, source_url, status, events_found, events_added, events_updated, started_at, finished_at) VALUES
('ウマ娘公式サイト', 'https://umamusume.jp/news/', 'success', 3, 3, 0, '2026-02-23 09:00:00+09', '2026-02-23 09:00:15+09'),
('Cygamesプレスリリース', 'https://www.cygames.co.jp/press/', 'success', 1, 0, 1, '2026-02-23 09:00:20+09', '2026-02-23 09:00:25+09');

-- 確認クエリ
SELECT 'イベント数: ' || COUNT(*) FROM events;
SELECT 'チケット数: ' || COUNT(*) FROM tickets;
