//カードの削除処理
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// カード削除
export async function deleteCard(cardId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("認証されていないユーザーです。");
  }

  // 削除対象のカードが自分のものであるか確認
  const card = await prisma.card.findUnique({
    where: { id: cardId },
  });

  if (!card || card.userId !== session.user.id) {
    throw new Error("削除権限がないか、カードが存在しません。");
  }

  // データベースから削除
  await prisma.card.delete({
    where: { id: cardId },
  });

  revalidatePath(`/notes/${session.user.id}`);
}
