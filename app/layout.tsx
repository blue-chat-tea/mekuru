// ルートのレイアウト
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

// HTMLの基本構造とフォントの設定
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// メタデータ（SEO・ブラウザのタブ情報）の設定
export const metadata: Metadata = {
  title: "Mekuru",
  description: "本と言葉のカードアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 認証プロバイダー（Providers）の適用 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
