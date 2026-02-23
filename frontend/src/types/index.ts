export * from './database'

// イベントタイプのラベル
export const EVENT_TYPE_LABELS: Record<string, string> = {
  live: 'ライブ',
  fanmeeting: 'ファンミーティング',
  exhibition: '展示会',
  other: 'その他',
}

// チケットステータスのラベル
export const TICKET_STATUS_LABELS: Record<string, string> = {
  upcoming: '販売予定',
  on_sale: '販売中',
  sold_out: '完売',
  ended: '販売終了',
  unknown: '不明',
}

// チケットステータスの色
export const TICKET_STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-800',
  on_sale: 'bg-green-100 text-green-800',
  sold_out: 'bg-red-100 text-red-800',
  ended: 'bg-gray-100 text-gray-800',
  unknown: 'bg-gray-100 text-gray-500',
}

// チケットタイプのラベル
export const TICKET_TYPE_LABELS: Record<string, string> = {
  general: '一般販売',
  premium: 'プレミアム',
  lottery: '抽選販売',
  resale: 'リセール',
}
