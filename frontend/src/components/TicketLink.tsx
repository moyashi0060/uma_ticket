'use client'

import { TicketInfo, TICKET_STATUS_LABELS, TICKET_STATUS_COLORS, TICKET_TYPE_LABELS } from '@/types'
import { formatDate, getSaleStatus } from '@/lib/utils'

interface TicketLinkProps {
  ticket: TicketInfo
}

export function TicketLink({ ticket }: TicketLinkProps) {
  // 販売期間から実際のステータスを計算
  const calculatedStatus = getSaleStatus(ticket.sale_start, ticket.sale_end)
  const displayStatus = ticket.status !== 'unknown' ? ticket.status : calculatedStatus
  
  return (
    <a
      href={ticket.ticket_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
    >
      <div className="flex-1 min-w-0">
        {/* プラットフォーム名 */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800 truncate">
            {ticket.platform_name}
          </span>
          <span className="text-xs text-gray-500">
            ({TICKET_TYPE_LABELS[ticket.ticket_type]})
          </span>
        </div>
        
        {/* 販売期間 */}
        {(ticket.sale_start || ticket.sale_end) && (
          <div className="text-xs text-gray-500 mt-1">
            {ticket.sale_start && formatDate(ticket.sale_start)}
            {ticket.sale_start && ticket.sale_end && ' 〜 '}
            {ticket.sale_end && formatDate(ticket.sale_end)}
          </div>
        )}
        
        {/* 価格情報 */}
        {ticket.price_info && (
          <div className="text-xs text-gray-600 mt-1">
            {ticket.price_info}
          </div>
        )}
      </div>
      
      {/* ステータスバッジ & 矢印 */}
      <div className="flex items-center gap-2 ml-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${TICKET_STATUS_COLORS[displayStatus]}`}>
          {TICKET_STATUS_LABELS[displayStatus]}
        </span>
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  )
}
