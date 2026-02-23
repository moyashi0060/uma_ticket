import { Suspense } from 'react'
import { EventCard, EventCardSkeleton } from '@/components'
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'
import type { EventWithTickets } from '@/types'

// データフェッチ関数
async function getEvents(): Promise<EventWithTickets[]> {
  // 環境変数が設定されていない場合はモックデータを返す
  if (!isSupabaseConfigured()) {
    return getMockEvents()
  }

  const supabase = createServerSupabaseClient()
  
  if (!supabase) {
    return getMockEvents()
  }
  
  const { data, error } = await supabase
    .from('active_events_with_tickets')
    .select('*')
  
  if (error) {
    console.error('Error fetching events:', error)
    return getMockEvents()
  }
  
  return (data as EventWithTickets[]) || []
}

// 開発用モックデータ
function getMockEvents(): EventWithTickets[] {
  return [
    {
      id: '1',
      title: 'ウマ娘 プリティーダービー 5th EVENT ARENA TOUR',
      description: 'ウマ娘 プリティーダービーの5周年を記念したアリーナツアー。豪華キャスト陣によるライブパフォーマンスをお届けします。',
      event_date: '2026-03-15T18:00:00+09:00',
      event_end_date: '2026-03-15T21:00:00+09:00',
      venue: 'さいたまスーパーアリーナ',
      image_url: null,
      source_url: 'https://umamusume.jp/news/',
      event_type: 'live',
      created_at: '2026-02-23T00:00:00+09:00',
      updated_at: '2026-02-23T00:00:00+09:00',
      tickets: [
        {
          ticket_id: 't1',
          platform_name: 'e+ (イープラス)',
          platform_icon: null,
          ticket_url: 'https://eplus.jp/',
          ticket_type: 'general',
          sale_start: '2026-02-20T10:00:00+09:00',
          sale_end: '2026-03-10T23:59:59+09:00',
          status: 'on_sale',
          price_info: '全席指定 ¥9,800（税込）',
        },
        {
          ticket_id: 't2',
          platform_name: 'ローソンチケット',
          platform_icon: null,
          ticket_url: 'https://l-tike.com/',
          ticket_type: 'general',
          sale_start: '2026-02-20T12:00:00+09:00',
          sale_end: '2026-03-10T23:59:59+09:00',
          status: 'on_sale',
          price_info: '全席指定 ¥9,800（税込）',
        },
      ],
    },
    {
      id: '2',
      title: 'ウマ娘 プリティーダービー ファンミーティング 2026春',
      description: 'キャスト陣とファンが直接交流できるファンミーティングイベント。トークショーやミニゲームを予定。',
      event_date: '2026-04-20T14:00:00+09:00',
      event_end_date: '2026-04-20T17:00:00+09:00',
      venue: 'パシフィコ横浜',
      image_url: null,
      source_url: 'https://umamusume.jp/news/',
      event_type: 'fanmeeting',
      created_at: '2026-02-23T00:00:00+09:00',
      updated_at: '2026-02-23T00:00:00+09:00',
      tickets: [
        {
          ticket_id: 't3',
          platform_name: 'e+ (イープラス)',
          platform_icon: null,
          ticket_url: 'https://eplus.jp/',
          ticket_type: 'lottery',
          sale_start: '2026-03-01T10:00:00+09:00',
          sale_end: '2026-03-15T23:59:59+09:00',
          status: 'upcoming',
          price_info: '一般 ¥5,500 / プレミアム ¥8,800（税込）',
        },
      ],
    },
    {
      id: '3',
      title: 'ウマ娘 プリティーダービー展 〜夢への一歩〜',
      description: 'ウマ娘の世界観を体験できる展示イベント。原画や衣装の展示、フォトスポットなど。',
      event_date: '2026-05-01T10:00:00+09:00',
      event_end_date: '2026-05-31T18:00:00+09:00',
      venue: '東京ドームシティ Gallery AaMo',
      image_url: null,
      source_url: 'https://umamusume.jp/news/',
      event_type: 'exhibition',
      created_at: '2026-02-23T00:00:00+09:00',
      updated_at: '2026-02-23T00:00:00+09:00',
      tickets: [
        {
          ticket_id: 't4',
          platform_name: 'ローソンチケット',
          platform_icon: null,
          ticket_url: 'https://l-tike.com/',
          ticket_type: 'general',
          sale_start: '2026-04-01T10:00:00+09:00',
          sale_end: '2026-05-30T23:59:59+09:00',
          status: 'upcoming',
          price_info: '一般 ¥2,000 / 中高生 ¥1,500 / 小学生 ¥800（税込）',
        },
      ],
    },
  ]
}

// イベント一覧コンポーネント
async function EventList() {
  const events = await getEvents()

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏇</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          現在表示できるイベントがありません
        </h3>
        <p className="text-gray-500">
          新しいイベント情報が追加されるまでお待ちください
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

// ローディングスケルトン
function EventListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヒーローセクション */}
      <section className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          ウマ娘 イベント・ライブ情報
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ウマ娘 プリティーダービー関連のライブ・イベント情報とチケット販売サイトへのリンクを一覧表示しています。
          チケット購入の際は公式サイトで最新情報をご確認ください。
        </p>
      </section>

      {/* フィルター（将来的に実装） */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium">
            すべて
          </span>
          <span className="px-4 py-2 bg-white text-gray-600 rounded-full text-sm font-medium border border-gray-200 hover:border-emerald-300 cursor-pointer transition-colors">
            ライブ
          </span>
          <span className="px-4 py-2 bg-white text-gray-600 rounded-full text-sm font-medium border border-gray-200 hover:border-emerald-300 cursor-pointer transition-colors">
            ファンミ
          </span>
          <span className="px-4 py-2 bg-white text-gray-600 rounded-full text-sm font-medium border border-gray-200 hover:border-emerald-300 cursor-pointer transition-colors">
            展示会
          </span>
        </div>
      </section>

      {/* イベント一覧 */}
      <section>
        <Suspense fallback={<EventListSkeleton />}>
          <EventList />
        </Suspense>
      </section>

      {/* 注意書き */}
      <section className="mt-12 p-6 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          ご注意ください
        </h3>
        <p className="text-sm text-amber-700">
          本サイトの情報は自動収集されたものであり、最新性・正確性を保証するものではありません。
          チケット購入前に必ず公式サイトで情報をご確認ください。
        </p>
      </section>
    </div>
  )
}
