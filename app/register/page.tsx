"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react"; // bookアイコンをインポート

export default function RegisterPage() {
  // 1.Stateの定義と初期化
  // 入力値
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 表示・状態管理
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  //エラーメッセージ
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2.イベントハンドリングとイベント準備
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // 送信状態のリセット
    setServerError(""); // 送信状態のリセット
    setLoading(true);

    // 3.APIとの通信
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      // 4. レスポンス判定と分岐処理
      if (!res.ok) {
        // エラー時
        if (data.errors) {
          // フィールド別のエラー（400）を反映
          setErrors(data.errors);
        } else {
          // 500エラーなど全体のエラー
          setServerError(data.error || "登録に失敗しました。");
        }
        return;
      }

      // 登録成功後、ログイン画面へ遷移
      router.push("/login");
    } catch (err) {
      console.error(err);
      setServerError("ネットワークエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  // 5. JavaScript XML でのレンダリング
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0] px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        {/* ヘッダーエリア（ロゴと見出しを統合し、余白を調整） */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="h-7 w-7 text-[#842D38]" />
            <span className="text-2xl font-bold tracking-wide text-gray-900">
              めくる
            </span>
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">新規登録</h1>
        </div>

        {/* サーバー全体エラー */}
        {serverError && (
          <div className="rounded bg-red-50 p-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* お名前 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ユーザー名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 shadow-sm focus:border-[#842D38] focus:outline-none focus:ring-1 focus:ring-[#842D38]"
              placeholder="山田 太郎"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 shadow-sm focus:border-[#842D38] focus:outline-none focus:ring-1 focus:ring-[#842D38]"
              placeholder="example@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* パスワード */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              パスワード（8文字以上）
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 shadow-sm focus:border-[#842D38] focus:outline-none focus:ring-1 focus:ring-[#842D38]"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#842D38] px-4 py-2 font-medium text-white transition-colors hover:bg-[#6E242E] focus:outline-none disabled:bg-[#842D38]/50"
          >
            {loading ? "登録中..." : "アカウントを作成"}
          </button>
        </form>

        {/* ログイン画面への案内リンク */}
        <p className="text-center text-sm text-gray-600">
          すでにアカウントをお持ちの方は{" "}
          <Link
            href="/login"
            className="font-medium text-[#842D38] transition-colors hover:text-[#6E242E] hover:underline"
          >
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
