-- =============================================
-- ウマ娘チケットポータル - 初期スキーマ
-- =============================================

-- UUID拡張を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. events テーブル (イベント情報)
-- =============================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ,
    event_end_date TIMESTAMPTZ,
    venue TEXT,
    image_url TEXT,
    source_url TEXT UNIQUE NOT NULL,
    event_type TEXT DEFAULT 'live' CHECK (event_type IN ('live', 'fanmeeting', 'exhibition', 'other')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_is_active ON events(is_active);
CREATE INDEX idx_events_source_url ON events(source_url);

-- コメント
COMMENT ON TABLE events IS 'ウマ娘関連イベント情報';
COMMENT ON COLUMN events.event_type IS 'イベント種別: live, fanmeeting, exhibition, other';
COMMENT ON COLUMN events.source_url IS '情報元URL（重複防止用ユニーク制約）';

-- =============================================
-- 2. ticket_platforms テーブル (チケット販売プラットフォーム)
-- =============================================
CREATE TABLE ticket_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    base_url TEXT NOT NULL,
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初期データ挿入
INSERT INTO ticket_platforms (name, display_name, base_url) VALUES
    ('eplus', 'e+ (イープラス)', 'https://eplus.jp'),
    ('lawson', 'ローソンチケット', 'https://l-tike.com'),
    ('zaiko', 'Zaiko', 'https://zaiko.io'),
    ('ticket_pia', 'チケットぴあ', 'https://t.pia.jp'),
    ('rakuten', '楽天チケット', 'https://ticket.rakuten.co.jp');

COMMENT ON TABLE ticket_platforms IS 'チケット販売プラットフォームマスタ';

-- =============================================
-- 3. tickets テーブル (チケット情報)
-- =============================================
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    platform_id UUID NOT NULL REFERENCES ticket_platforms(id) ON DELETE RESTRICT,
    ticket_url TEXT NOT NULL,
    ticket_type TEXT DEFAULT 'general' CHECK (ticket_type IN ('general', 'premium', 'lottery', 'resale')),
    sale_start TIMESTAMPTZ,
    sale_end TIMESTAMPTZ,
    status TEXT DEFAULT 'unknown' CHECK (status IN ('upcoming', 'on_sale', 'sold_out', 'ended', 'unknown')),
    price_info TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, platform_id, ticket_type)
);

-- インデックス
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_sale_start ON tickets(sale_start);

COMMENT ON TABLE tickets IS 'チケット販売情報';
COMMENT ON COLUMN tickets.ticket_type IS 'チケット種別: general(一般), premium(プレミアム), lottery(抽選), resale(リセール)';
COMMENT ON COLUMN tickets.status IS '販売状況: upcoming, on_sale, sold_out, ended, unknown';

-- =============================================
-- 4. scrape_logs テーブル (スクレイピングログ)
-- =============================================
CREATE TABLE scrape_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'error', 'skipped')),
    events_found INTEGER DEFAULT 0,
    events_added INTEGER DEFAULT 0,
    events_updated INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_scrape_logs_created_at ON scrape_logs(created_at);
CREATE INDEX idx_scrape_logs_status ON scrape_logs(status);

COMMENT ON TABLE scrape_logs IS 'スクレイピング実行ログ';

-- =============================================
-- 5. 更新日時自動更新トリガー
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- events テーブル用トリガー
CREATE TRIGGER trigger_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- tickets テーブル用トリガー
CREATE TRIGGER trigger_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 6. Row Level Security (RLS) 設定
-- =============================================

-- RLS有効化
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_logs ENABLE ROW LEVEL SECURITY;

-- 公開読み取りポリシー (誰でも読める)
CREATE POLICY "Events are publicly readable"
    ON events FOR SELECT
    USING (true);

CREATE POLICY "Tickets are publicly readable"
    ON tickets FOR SELECT
    USING (true);

CREATE POLICY "Ticket platforms are publicly readable"
    ON ticket_platforms FOR SELECT
    USING (true);

-- サービスロール用書き込みポリシー (スクレイパーからの書き込み)
CREATE POLICY "Service role can insert events"
    ON events FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update events"
    ON events FOR UPDATE
    USING (true);

CREATE POLICY "Service role can insert tickets"
    ON tickets FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update tickets"
    ON tickets FOR UPDATE
    USING (true);

CREATE POLICY "Service role can insert scrape_logs"
    ON scrape_logs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can select scrape_logs"
    ON scrape_logs FOR SELECT
    USING (true);

-- =============================================
-- 7. ビュー: アクティブイベント一覧
-- =============================================
CREATE VIEW active_events_with_tickets AS
SELECT 
    e.id,
    e.title,
    e.description,
    e.event_date,
    e.event_end_date,
    e.venue,
    e.image_url,
    e.source_url,
    e.event_type,
    e.created_at,
    e.updated_at,
    COALESCE(
        json_agg(
            json_build_object(
                'ticket_id', t.id,
                'platform_name', tp.display_name,
                'platform_icon', tp.icon_url,
                'ticket_url', t.ticket_url,
                'ticket_type', t.ticket_type,
                'sale_start', t.sale_start,
                'sale_end', t.sale_end,
                'status', t.status,
                'price_info', t.price_info
            )
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'::json
    ) AS tickets
FROM events e
LEFT JOIN tickets t ON e.id = t.event_id
LEFT JOIN ticket_platforms tp ON t.platform_id = tp.id
WHERE e.is_active = TRUE
GROUP BY e.id
ORDER BY e.event_date ASC NULLS LAST;

COMMENT ON VIEW active_events_with_tickets IS 'アクティブなイベントとチケット情報の結合ビュー';
