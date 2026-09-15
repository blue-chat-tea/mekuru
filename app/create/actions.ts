"use server";

import { auth } from "@/auth"; // ※プロジェクトのAuth.jsのパスに合わせて調整してください
import { prisma } from "@/lib/prisma"; // ※Prismaクライアントのインポート元に合わせて調整
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCard(formData: FormData) {
  // 1. ログイン中のセッションからユーザー情報を取得
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("認証されていないユーザーです。");
  }

  // 2. フォームから値を取り出す
  const quote = formData.get("quote") as string;
  const bookTitle = formData.get("bookTitle") as string;
  const authorName = formData.get("authorName") as string;
  const isPublic = formData.get("isPublic") === "true"; // トグルの値

  // 簡易バリデーション（文字数など）
  if (!quote || quote.length > 100) {
    throw new Error("言葉は100文字以内で入力してください。");
  }
  if (!bookTitle) {
    throw new Error("本のタイトルは必須です。");
  }

  // 3. データベースに保存
  await prisma.card.create({
    data: {
      quote,
      bookTitle,
      authorName: authorName || null,
      isPublic,
      userId: session.user.id,
    },
  });

  // 4. キャッシュを更新してマイノート（あるいはタイムライン）へリダイレクト
  revalidatePath("/notes");
  redirect("/notes");
}
