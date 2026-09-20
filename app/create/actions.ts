// 言葉の登録・編集処理
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// カード作成
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

  // 4. キャッシュを更新してログイン中のユーザーのマイノートへリダイレクト
  revalidatePath(`/notes/${session.user.id}`);
  redirect(`/notes/${session.user.id}`);
}

export async function updateCard(cardId: string, formData: FormData) {
  const quote = formData.get("quote") as string;
  const bookTitle = formData.get("bookTitle") as string;
  const authorName = formData.get("authorName") as string;
  const isPublic = formData.get("isPublic") === "true";

  if (!quote || !bookTitle) {
    throw new Error("必須項目が入力されていません。");
  }

  // データベースのカードを更新
  await prisma.card.update({
    where: { id: cardId },
    data: {
      quote,
      bookTitle,
      authorName: authorName || null,
      isPublic,
    },
  });

  // 更新が終わったらホームやマイノートなどにリダイレクト
  redirect("/");
}
