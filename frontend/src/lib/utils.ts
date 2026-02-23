/**
 * 日付をフォーマット
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return '未定'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

/**
 * 日時をフォーマット
 */
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return '未定'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 残り日数を計算
 */
export function getDaysRemaining(dateString: string | null): number | null {
  if (!dateString) return null
  
  const eventDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)
  
  const diffTime = eventDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * 残り日数の表示テキスト
 */
export function getDaysRemainingText(dateString: string | null): string {
  const days = getDaysRemaining(dateString)
  
  if (days === null) return ''
  if (days < 0) return '終了'
  if (days === 0) return '本日'
  if (days === 1) return '明日'
  
  return `あと${days}日`
}

/**
 * 販売期間のステータス判定
 */
export function getSaleStatus(
  saleStart: string | null,
  saleEnd: string | null
): 'upcoming' | 'on_sale' | 'ended' {
  const now = new Date()
  
  if (saleStart) {
    const start = new Date(saleStart)
    if (now < start) return 'upcoming'
  }
  
  if (saleEnd) {
    const end = new Date(saleEnd)
    if (now > end) return 'ended'
  }
  
  return 'on_sale'
}
