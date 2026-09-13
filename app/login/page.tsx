"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react"; // bookアイコンをインポート

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 新規登録と同じエラー管理構造に変更
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    // 簡易的なクライアント側バリデーション
    const newErrors: { [key: string]: string } = {};
    if (!email) newErrors.email = "メールアドレスを入力してください。";
    if (!password) newErrors.password = "パスワードを入力してください。";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        // 認証失敗時、各入力欄の下、または全体エラー枠に表示
        setServerError("メールアドレスまたはパスワードが正しくありません。");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setServerError("ログイン中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0] px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        {/* ヘッダーエリア*/}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="h-7 w-7 text-[#842D38]" />
            <span className="text-2xl font-bold tracking-wide text-gray-900">
              めくる
            </span>
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">ログイン</h1>
        </div>

        {/* サーバー全体エラーメッセージ */}
        {serverError && (
          <div className="rounded bg-red-50 p-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#842D38] focus:outline-none focus:ring-1 focus:ring-[#842D38]"
              placeholder="example@example.com"
            />
            {/* 新規登録と同じ個別の赤文字エラー */}
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* パスワード */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#842D38] focus:outline-none focus:ring-1 focus:ring-[#842D38]"
            />
            {/* パスワードのエラーメッセージ表示部分 */}
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#842D38] px-4 py-2 font-medium text-white transition-colors hover:bg-[#6E242E] focus:outline-none disabled:bg-[#842D38]/50"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          アカウントをお持ちでない方は{" "}
          <Link
            href="/register"
            className="font-medium text-[#842D38] transition-colors hover:text-[#6E242E] hover:underline"
          >
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
