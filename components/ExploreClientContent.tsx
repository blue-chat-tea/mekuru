"use client";

import { useState } from "react";
import Link from "next/link";

// ユーザー情報を含むカードの型定義
type PublicCardItem = {
  id: string;
  quote: string;
  bookTitle: string;
  authorName: string | null;
  isbn: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
};

type ExploreClientContentProps = {
  cards: PublicCardItem[];
};

export default function ExploreClientContent({
  cards,
}: ExploreClientContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // アニメーションの方向（'left' または 'right'）
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );

  if (cards.length === 0) {
    return (
      <p className="text-sm text-gray-500 mt-10">
        まだ誰も言葉を投稿していません。
      </p>
    );
  }

  const safeIndex = Math.min(currentIndex, cards.length - 1);
  const currentCard = cards[safeIndex];
  const totalCards = cards.length;

  const handlePrev = () => {
    if (safeIndex > 0) {
      setSlideDirection("left");
      setCurrentIndex(safeIndex - 1);
    }
  };

  const handleNext = () => {
    if (safeIndex < totalCards - 1) {
      setSlideDirection("right");
      setCurrentIndex(safeIndex + 1);
    }
  };

  // 本のリンク生成（ISBNがあればAmazonのASIN/ISBNページ、なければ検索リンク）
  const bookLink = currentCard.isbn
    ? `https://www.amazon.co.jp/dp/${currentCard.isbn}`
    : `https://www.amazon.co.jp/s?k=${encodeURIComponent(currentCard.bookTitle)}`;

  return (
    <div className="w-full max-w-sm flex flex-col items-center space-y-4">
      {/* カード本体 */}
      <div
        key={safeIndex}
        className={`w-full h-[400px] flex flex-col justify-between bg-white rounded-3xl p-6 shadow-sm relative transition-all duration-500 ease-out transform ${
          slideDirection === "right"
            ? "animate-slide-in-right"
            : "animate-slide-in-left"
        }`}
      >
        {/* 言葉 */}
        <div className="flex-1 flex items-center">
          <p className="font-serif text-lg leading-relaxed text-gray-800 whitespace-pre-wrap line-clamp-6">
            {currentCard.quote}
          </p>
        </div>

        {/* 本のタイトル（リンク）と著者 */}
        <div className="flex flex-col items-end pb-2">
          <div className="text-right">
            <Link
              href={bookLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xs text-[#7A2E3B] font-bold hover:underline"
            >
              {currentCard.bookTitle}
            </Link>
            <p className="font-serif text-xs text-gray-500 mt-0.5">
              {currentCard.authorName || "著者不明"}
            </p>
          </div>
        </div>

        {/* ユーザー情報（リンク）と日付 */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-4 text-xs text-gray-500">
          <Link
            href={`/notes/${currentCard.user.id}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#7A2E3B]/80 flex items-center justify-center text-white font-bold">
              {currentCard.user.name.charAt(0)}
            </div>
            <span className="text-gray-700 font-medium">
              {currentCard.user.name}
            </span>
          </Link>
          <span>{new Date(currentCard.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* ページネーション（例: 2/1000） */}
      <div className="flex items-center justify-center gap-4 text-sm text-gray-600 pt-2">
        <button
          onClick={handlePrev}
          disabled={safeIndex === 0}
          className="disabled:opacity-30 hover:text-[#7A2E3B] transition-colors px-2 py-1"
        >
          ◀ 前へ
        </button>
        <span>
          {safeIndex + 1} / {totalCards}
        </span>
        <button
          onClick={handleNext}
          disabled={safeIndex === totalCards - 1}
          className="disabled:opacity-30 hover:text-[#7A2E3B] transition-colors px-2 py-1"
        >
          次へ ▶
        </button>
      </div>
    </div>
  );
}
