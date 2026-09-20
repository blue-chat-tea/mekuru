"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { createCard } from "@/app/_actions/cardActions";

type BookItem = {
  id: string;
  title: string;
  author: string;
  thumbnail: string | null;
};

export default function CreateCardForm() {
  const [quoteLength, setQuoteLength] = useState(0);

  // フォームの入力値を管理するステート
  const [bookTitle, setBookTitle] = useState("");
  const [authorName, setAuthorName] = useState("");

  // 検索関連のステート
  const [searchResults, setSearchResults] = useState<BookItem[]>([]);
  const [showResults, setShowResults] = useState(false);

  // タイトルが入力されたら自動でAPIを叩く
  useEffect(() => {
    if (!bookTitle || bookTitle.trim() === "") {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/books?q=${encodeURIComponent(bookTitle)}`,
        );
        const results = await res.json();

        if (Array.isArray(results)) {
          setSearchResults(results);
          setShowResults(true);
        } else {
          setSearchResults([]);
          setShowResults(false);
        }
      } catch (error) {
        console.error("検索エラー:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [bookTitle]);

  // タイトル入力欄の onChange（ここで空文字のときのクリアも安全に行う）
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBookTitle(value);

    if (!value || value.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // 候補の選択時
  const handleSelectBook = (book: BookItem) => {
    setBookTitle(book.title);
    setAuthorName(book.author !== "著者不明" ? book.author : "");
    setShowResults(false); // リストを閉じる
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2]">
      <Header />

      <main className="flex flex-1 flex-col items-center px-6 py-6 pb-24">
        <h1 className="text-xl font-bold text-gray-800 mb-6">書き留める</h1>

        <form action={createCard} className="w-full max-w-sm space-y-5">
          {/* 心に残ったことば */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <svg
                className="w-4 h-4 text-[#7A2E3B]"
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
              心に残ったことば
            </label>
            <div className="bg-white rounded-3xl p-4 shadow-sm">
              <textarea
                name="quote"
                maxLength={100}
                rows={4}
                required
                placeholder="心に残ったことばを入力してください"
                onChange={(e) => setQuoteLength(e.target.value.length)}
                className="w-full resize-none border-none bg-transparent font-serif text-base leading-relaxed text-gray-800 focus:outline-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {quoteLength}/100
              </div>
            </div>
          </div>

          {/* 本のタイトル（検索連動） */}
          <div className="space-y-1.5 relative">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <svg
                className="w-4 h-4 text-[#7A2E3B]"
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
              本のタイトル
            </label>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <input
                type="text"
                name="bookTitle"
                value={bookTitle}
                onChange={handleTitleChange}
                required
                placeholder="本のタイトルを入力（検索）"
                className="w-full border-none bg-transparent text-sm text-gray-700 focus:outline-none"
                autoComplete="off"
              />
            </div>

            {/* 検索候補ドロップダウン */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto bg-white rounded-2xl shadow-lg border border-stone-100 p-2 space-y-1">
                <div className="px-3 py-1 text-[10px] text-stone-400 font-medium">
                  候補から選択してください
                </div>
                {searchResults.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleSelectBook(book)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    {book.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-8 h-12 object-cover rounded shadow-xs"
                      />
                    ) : (
                      // 画像がない場合のプレースホルダー（必要に応じて枠やアイコン、あるいは空のボックスにするなど）
                      <div className="w-8 h-12 bg-stone-100 rounded flex items-center justify-center text-[10px] text-stone-400">
                        No img
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-800 truncate">
                        {book.title}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">
                        {book.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 著者名 */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <svg
                className="w-4 h-4 text-[#7A2E3B]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              著者
            </label>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <input
                type="text"
                name="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="著者名を入力"
                className="w-full border-none bg-transparent text-sm text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          {/* 公開設定（トグルスイッチ） */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <svg
                className="w-4 h-4 text-[#7A2E3B]"
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
              公開設定
            </label>
            <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm">
              <span className="text-xs text-gray-500">
                タイムラインに公開する
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublic"
                  value="true"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14AE5C]"></div>
              </label>
            </div>
          </div>

          {/* キャンセル、保存ボタン */}
          <div className="flex gap-3 pt-4">
            <Link
              href="/"
              className="flex-1 py-3 rounded-full border border-[#7A2E3B] text-[#7A2E3B] font-medium text-center hover:bg-[#7A2E3B]/5 transition-colors block"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-[#7A2E3B] text-white font-medium text-center shadow-md hover:bg-[#63242f] transition-colors"
            >
              保存する
            </button>
          </div>
        </form>
      </main>

      <Navigation activeTab="create" />
    </div>
  );
}
