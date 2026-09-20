"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { createCard } from "@/app/create/actions";

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
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          言葉を書き留める
        </h1>

        <form action={createCard} className="w-full max-w-sm space-y-5">
          {/* 心に残ったことば */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
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
            <label className="text-sm font-medium text-gray-700">
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
            <label className="text-sm font-medium text-gray-700">
              著者（任意）
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7A2E3B]"></div>
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
