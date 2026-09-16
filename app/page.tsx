"use client";

import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function HomePage() {
  const { data: session } = useSession();

  // ダミーデータ（Phase 3でDBから取得するように繋ぎ込みます）
  const sampleCard = {
    quote:
      "本を読み、\n抜き書きをすると、\n自分の愛してやまないもの、\n大切に思っている価値が、\nはっきり形をとるようになる。",
    bookTitle: "百冊で耕す",
    authorName: "加藤耕太郎",
    createdAt: "2026/08/30",
    userName: session?.user?.name || "はるか",
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2]">
      {/* 共通ヘッダー（ハンバーガーメニュー含む） */}
      <Header />

      {/* メインコンテンツエリア */}
      <main className="flex flex-1 flex-col items-center justify-between px-6 py-6">
        <h1 className="text-xl font-bold text-gray-800">めぐる言葉</h1>

        {/* 言葉カード */}
        <div className="my-6 w-full max-w-sm rounded-3xl bg-white p-6 shadow-sm flex flex-col justify-between min-h-[360px]">
          {/* 引用テキスト */}
          <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-800 font-serif">
            {sampleCard.quote}
          </p>

          <div>
            {/* 本のタイトル・著者 */}
            <div className="text-right mb-6">
              <p className="font-semibold text-[#7A2E3B]">
                {sampleCard.bookTitle}
              </p>
              <p className="text-sm text-gray-500">{sampleCard.authorName}</p>
            </div>

            {/* ユーザー情報・日付 */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-stone-300" />
                <span className="text-sm text-gray-600">
                  {sampleCard.userName}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {sampleCard.createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* ページネーション（カウント表示） */}
        <div className="text-sm text-gray-600 mb-4">1/1000</div>
      </main>

      {/* 下部ナビゲーションバー（共通化） */}
      <Navigation activeTab="home" />
    </div>
  );
}
