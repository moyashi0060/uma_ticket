import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ・タイトル */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-2xl">🏇</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                ウマ娘チケットポータル
              </h1>
              <p className="text-xs text-emerald-100 hidden sm:block">
                Uma Musume Ticket Portal
              </p>
            </div>
          </Link>

          {/* ナビゲーション */}
          <nav className="flex items-center gap-4">
            <a
              href="https://umamusume.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-100 hover:text-white transition-colors"
            >
              公式サイト
            </a>
          </nav>
        </div>
      </div>

      {/* 装飾ライン（ターフをイメージ） */}
      <div className="h-1 bg-gradient-to-r from-green-300 via-emerald-200 to-green-300"></div>
    </header>
  )
}
