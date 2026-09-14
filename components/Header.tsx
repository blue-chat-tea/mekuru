'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <header className="relative flex items-center justify-between border-b border-stone-200 bg-[#FAF7F2] px-6 py-4">
      {/* ロゴエリア */}
      <div className="flex items-center space-x-2">
        <svg className="h-7 w-7 text-[#7A2E3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className="text-xl font-bold text-gray-900">めくる</span>
      </div>

      {/* ハンバーガーボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-700 focus:outline-none"
        aria-label="メニューを開く"
      >
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* メニューのドロップダウン */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 w-48 border border-stone-200 bg-[#E8E4DF] py-2 shadow-lg">
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="block px-6 py-3 font-semibold text-gray-800 hover:bg-[#DDD8D1]"
          >
            アカウント設定
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full px-6 py-3 text-left font-semibold text-gray-800 hover:bg-[#DDD8D1]"
          >
            ログアウト
          </button>
        </div>
      )}
    </header>
  )
}
