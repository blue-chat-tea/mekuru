"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { deleteCard } from "@/app/_actions/cardActions";
import Link from "next/link";

type CardItem = {
  id: string;
  quote: string;
  bookTitle: string;
  authorName: string | null;
  isbn: string | null; // ★ isbnを追加
  isPublic: boolean;
  createdAt: Date;
};

type NotesClientContentProps = {
  cards: CardItem[];
  userName: string;
  isOwner: boolean; // 保持者フラグ
};

export default function NotesClientContent({
  cards: initialCards,
  userName,
  isOwner,
}: NotesClientContentProps) {
  const [cards, setCards] = useState<CardItem[]>(initialCards);
  const [isDeleting, setIsDeleting] = useState(false);

  // モーダルの開閉状態を管理するステート
  const [isModalOpen, setIsModalOpen] = useState(false);

  // アニメーションの方向（'left' または 'right'）を保持
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );

  // URLの ?highlight=... を取得し、対応するカードのインデックスを初期値にする
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!highlightId) return 0;
    const index = initialCards.findIndex((c) => c.id === highlightId);
    return index !== -1 ? index : 0; // 見つからなければ0番目
  });

  if (cards.length === 0) {
    return (
      <p className="text-sm text-gray-500 mt-10">
        まだ言葉が書き留められていません。
      </p>
    );
  }

  // 現在のインデックスが配列の長さを超えないように安全策
  const safeIndex = Math.min(currentIndex, cards.length - 1);
  const currentCard = cards[safeIndex];
  const totalCards = cards.length;

  // 前のカードへ
  const handlePrev = () => {
    if (safeIndex > 0) {
      setSlideDirection("left");
      setCurrentIndex(safeIndex - 1);
    }
  };

  // 次のカードへ
  const handleNext = () => {
    if (safeIndex < totalCards - 1) {
      setSlideDirection("right");
      setCurrentIndex(safeIndex + 1);
    }
  };

  // 削除処理（モーダル内の「削除する」から呼ばれる）
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCard(currentCard.id);

      // フロント側の状態からも削除して即時反映させる
      const updatedCards = cards.filter((c) => c.id !== currentCard.id);
      setCards(updatedCards);

      // もし最後のカードを消したら、インデックスを一つ前に戻す
      if (safeIndex >= updatedCards.length && updatedCards.length > 0) {
        setCurrentIndex(updatedCards.length - 1);
      }

      // 削除できたらモーダルを閉じる
      setIsModalOpen(false);
    } catch (error) {
      console.error("削除に失敗しました", error);
      alert("削除に失敗しました。");
    } finally {
      setIsDeleting(false);
    }
  };

  // ★ 本のリンク生成（ISBNがあればAmazonのASIN/ISBNページ、なければ検索リンク）
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
        {/* 公開ステータス */}
        <div className="flex justify-end items-center gap-1.5 text-xs text-[#A3978E]">
          {currentCard.isPublic ? (
            <>
              {/* 公開アイコン */}
              <svg
                className="w-4 h-4 text-[#A3978E]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              <span>公開</span>
            </>
          ) : (
            <>
              {/* 非公開アイコン */}
              <svg
                className="w-4 h-4 text-[#A3978E]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <span>非公開</span>
            </>
          )}
        </div>

        {/* 言葉 */}
        <div className="flex-1 flex items-center">
          <p className="font-serif text-lg leading-relaxed text-gray-800 whitespace-pre-wrap line-clamp-6">
            {currentCard.quote}
          </p>
        </div>

        {/* 本のタイトルと著者 */}
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

        {/* ユーザー情報と日付 */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#7A2E3B]/80 flex items-center justify-center text-white font-bold">
              {userName.charAt(0)}
            </div>
            <span>{userName}</span>
          </div>
          <span>{new Date(currentCard.createdAt).toLocaleDateString()}</span>
        </div>

        {/* 本人（isOwner）のときだけ編集・削除ボタンを表示する */}
        {isOwner && (
          <div className="flex justify-end gap-4 pt-2 text-xs">
            <Link
              href={`/create/${currentCard.id}`}
              className="flex items-center gap-1 text-[#A3978E] hover:text-[#7A2E3B] transition-colors"
            >
              <svg
                className="w-4 h-4 text-[#A3978E]"
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
              <span>編集</span>
            </Link>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 text-[#A3978E] hover:text-[#7A2E3B] transition-colors"
            >
              <svg
                className="w-4 h-4 text-[#A3978E]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              <span>削除</span>
            </button>
          </div>
        )}
      </div>

      {/* ページネーション表示と切り替え用ボタン */}
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

      {/* 削除確認モーダル */}
      {isOwner && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-stone-100 text-center space-y-4">
            <h3 className="text-base font-bold text-stone-800">
              言葉を削除しますか？
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              この動作は元に戻すことができません。
              <br />
              本当にこの言葉を削除してもよろしいですか？
            </p>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-stone-200 py-2.5 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors"
              >
                やめる
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-[#7A2E3B] py-2.5 text-xs font-medium text-white hover:bg-[#63242f] transition-colors disabled:opacity-50"
              >
                {isDeleting ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
