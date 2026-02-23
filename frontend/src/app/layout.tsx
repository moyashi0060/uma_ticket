import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "ウマ娘チケットポータル | Uma Musume Ticket Portal",
  description: "ウマ娘 プリティーダービー関連のライブ・イベントチケット情報を一覧表示するポータルサイト",
  keywords: ["ウマ娘", "チケット", "ライブ", "イベント", "Cygames"],
  openGraph: {
    title: "ウマ娘チケットポータル",
    description: "ウマ娘関連イベント・ライブのチケット情報を一覧表示",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} font-sans antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
