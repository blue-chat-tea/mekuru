"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { createCard } from "@/app/create/actions"; // 新規作成用のServer Action

export default function CreateCardForm() {
  const [quoteLength, setQuoteLength] = useState(0);

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

          {/* 本のタイトル */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              本のタイトル
            </label>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <input
                type="text"
                name="bookTitle"
                required
                placeholder="本のタイトルを入力"
                className="w-full border-none bg-transparent text-sm text-gray-700 focus:outline-none"
              />
            </div>
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

          {/* ボタン */}
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
