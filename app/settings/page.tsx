"use client";

import { useState } from "react"; // ★ useEffect
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState(session?.user?.name || "");
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); // 退会確認画面フラグ
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ユーザー情報の更新
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password: password || undefined }),
      });

      if (!res.ok) {
        throw new Error("更新に失敗しました。");
      }

      // セッションを更新する
      await update({ name });

      setMessage("アカウント情報を更新しました。");
      setPassword("");
    } catch {
      setError("更新処理中にエラーが発生しました。");
    }
  };

  // アカウント削除（退会処理）
  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (!res.ok) throw new Error();

      // ログアウトしてログイン画面へ
      await signOut({ callbackUrl: "/login" });
    } catch {
      setError("退会処理に失敗しました。");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2]">
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
          {/* ロゴ */}
          <div className="mb-6 flex justify-center items-center space-x-2">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <svg
                className="h-8 w-8 text-[#7A2E3B]"
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
              <span className="text-2xl font-bold text-gray-900">めくる</span>
            </Link>
          </div>

          {!isDeleting ? (
            /* 通常のアカウント設定表示 (スクリーンショット 3) */
            <>
              <h1 className="mb-6 text-center text-xl font-bold text-gray-800">
                アカウント設定
              </h1>

              {message && (
                <div className="mb-4 text-center text-sm text-green-600">
                  {message}
                </div>
              )}
              {error && (
                <div className="mb-4 text-center text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    ユーザー名
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-[#7A2E3B] bg-[#FAF7F2] px-3 py-2 text-gray-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    メールアドレス
                  </label>
                  <p className="mt-1 text-gray-500">
                    {session?.user?.email || "yuki@example.com"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    パスワード
                  </label>
                  <input
                    type="password"
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-[#7A2E3B] bg-[#FAF7F2] px-3 py-2 text-gray-800 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between pt-4 space-x-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-1/2 rounded-full border border-[#7A2E3B] py-2 font-medium text-gray-800 hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 rounded-full bg-[#7A2E3B] py-2 font-medium text-white hover:bg-[#62232E]"
                  >
                    更新
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm text-gray-600">
                アカウントを削除・退会したい方は{" "}
                <button
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  className="text-[#7A2E3B] underline"
                >
                  こちら
                </button>
              </div>
            </>
          ) : (
            /* 退会確認表示 (スクリーンショット 4) */
            <div className="text-center space-y-6">
              <div className="flex justify-center items-center space-x-2 text-xl font-bold text-gray-800">
                <span className="text-2xl">⚠️</span>
                <h2>退会しますか？</h2>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                退会するとアカウントや登録した内容が
                <br />
                削除されます。
              </p>

              <div className="space-y-3 pt-4">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full rounded-full bg-[#7A2E3B] py-2 font-medium text-white hover:bg-[#62232E]"
                >
                  退会する
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="w-full rounded-full border border-[#7A2E3B] py-2 font-medium text-gray-800 hover:bg-gray-50"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
