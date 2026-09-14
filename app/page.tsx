"use client";

import { useSession } from "next-auth/react";
import Header from "@/components/Header";

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

      {/* 下部ナビゲーションバー */}
      <nav className="flex justify-around border-t border-stone-200 bg-white py-3">
        <button className="flex flex-col items-center text-[#7A2E3B]">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="mt-1 text-xs font-bold">めぐる言葉</span>
        </button>

        <button className="flex flex-col items-center text-gray-400 hover:text-gray-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className="mt-1 text-xs">マイノート</span>
        </button>

        <button className="flex flex-col items-center text-gray-400 hover:text-gray-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <span className="mt-1 text-xs">書き留める</span>
        </button>
      </nav>
    </div>
  );
}
