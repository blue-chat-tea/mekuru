"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateCard(cardId: string, formData: FormData) {
  const quote = formData.get("quote") as string;
  const bookTitle = formData.get("bookTitle") as string;
  const authorName = formData.get("authorName") as string;
  const isPublic = formData.get("isPublic") === "true";

  if (!quote || !bookTitle) {
    throw new Error("必須項目が入力されていません。");
  }

  // データベースのカードを更新
  const updatedCard = await prisma.card.update({
    where: { id: cardId },
    data: {
      quote,
      bookTitle,
      authorName: authorName || null,
      isPublic,
    },
  });

  // 更新後、そのカードがハイライトされるようにクエリをつけてマイノートへリダイレクト
  redirect(`/notes/${updatedCard.userId}?highlight=${updatedCard.id}`);
}
