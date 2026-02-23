export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      {/* ヘッダー部分 */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-200 p-4">
        <div className="h-6 bg-gray-400/30 rounded w-3/4"></div>
      </div>

      {/* コンテンツ部分 */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>

        <div className="h-10 bg-gray-200 rounded"></div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  )
}
