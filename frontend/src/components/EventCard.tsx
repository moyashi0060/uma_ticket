'use client'

import { EventWithTickets, EVENT_TYPE_LABELS } from '@/types'
import { formatDate, getDaysRemaining, getDaysRemainingText } from '@/lib/utils'
import { TicketLink } from './TicketLink'

interface EventCardProps {
  event: EventWithTickets
}

export function EventCard({ event }: EventCardProps) {
  const daysRemaining = getDaysRemaining(event.event_date)
  const daysText = getDaysRemainingText(event.event_date)
  
  // 残り日数に応じた色
  const getDaysColor = () => {
    if (daysRemaining === null) return 'bg-gray-100 text-gray-600'
    if (daysRemaining < 0) return 'bg-gray-100 text-gray-500'
    if (daysRemaining <= 3) return 'bg-red-100 text-red-700'
    if (daysRemaining <= 7) return 'bg-orange-100 text-orange-700'
    if (daysRemaining <= 14) return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {/* ヘッダー部分 */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-green-500 p-4">
        {/* イベントタイプバッジ */}
        <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
        </span>
        
        {/* タイトル */}
        <h3 className="text-xl font-bold text-white pr-20 line-clamp-2">
          {event.title}
        </h3>
      </div>

      {/* コンテンツ部分 */}
      <div className="p-4 space-y-4">
        {/* 日程・会場 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{formatDate(event.event_date)}</span>
            {daysText && (
              <span className={`ml-auto text-xs px-2 py-1 rounded-full font-bold ${getDaysColor()}`}>
                {daysText}
              </span>
            )}
          </div>
          
          {event.venue && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.venue}</span>
            </div>
          )}
        </div>

        {/* 説明文 */}
        {event.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {event.description}
          </p>
        )}

        {/* チケット情報 */}
        {event.tickets && event.tickets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              チケット情報
            </h4>
            <div className="space-y-2">
              {event.tickets.map((ticket) => (
                <TicketLink key={ticket.ticket_id} ticket={ticket} />
              ))}
            </div>
          </div>
        )}

        {/* 公式サイトリンク */}
        <a
          href={event.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-sm text-emerald-600 hover:text-emerald-700 hover:underline pt-2 border-t border-gray-100"
        >
          公式サイトで詳細を見る →
        </a>
      </div>
    </div>
  )
}
