export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* サイト情報 */}
          <div>
            <h3 className="text-white font-semibold mb-3">ウマ娘チケットポータル</h3>
            <p className="text-sm">
              ウマ娘関連イベント・ライブのチケット情報を自動収集し、一覧表示するポータルサイトです。
            </p>
          </div>

          {/* 外部リンク */}
          <div>
            <h3 className="text-white font-semibold mb-3">公式リンク</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://umamusume.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  ウマ娘 プリティーダービー 公式サイト
                </a>
              </li>
              <li>
                <a href="https://www.cygames.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Cygames
                </a>
              </li>
            </ul>
          </div>

          {/* 免責事項 */}
          <div>
            <h3 className="text-white font-semibold mb-3">ご注意</h3>
            <p className="text-xs leading-relaxed">
              本サイトは非公式のファンサイトです。「ウマ娘 プリティーダービー」はCygames, Inc.の登録商標です。
              チケット購入の際は必ず公式サイトで最新情報をご確認ください。
            </p>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
          <p>© 2026 Uma Musume Ticket Portal. This is a portfolio project.</p>
          <p className="mt-1">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
