"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

type NavigationProps = {
  activeTab: "home" | "notes" | "create";
};

export default function Navigation({ activeTab }: NavigationProps) {
  // クライアント側でセッション情報を安全に取得
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // 自分のIDがあれば /notes/ユーザーID、なければログインページへ
  const notesHref = userId ? `/notes/${userId}` : "/login";

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-stone-200 bg-white py-3 shadow-lg z-40">
      {/* めぐる言葉 (ホーム) */}
      <Link
        href="/"
        className={`flex flex-col items-center ${
          activeTab === "home"
            ? "text-[#7A2E3B]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
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
        <span
          className={`mt-1 text-xs ${activeTab === "home" ? "font-bold" : ""}`}
        >
          めぐる言葉
        </span>
      </Link>

      {/* マイノート（動的なIDへリンク） */}
      <Link
        href={notesHref}
        className={`flex flex-col items-center ${
          activeTab === "notes"
            ? "text-[#7A2E3B]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
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
        <span
          className={`mt-1 text-xs ${activeTab === "notes" ? "font-bold" : ""}`}
        >
          マイノート
        </span>
      </Link>

      {/* 書き留める */}
      <Link
        href="/create"
        className={`flex flex-col items-center ${
          activeTab === "create"
            ? "text-[#7A2E3B]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
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
        <span
          className={`mt-1 text-xs ${activeTab === "create" ? "font-bold" : ""}`}
        >
          書き留める
        </span>
      </Link>
    </nav>
  );
}
