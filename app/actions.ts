// データベースからアプリ内の公開設定になっているカードを新しい順に取得するアクション
// どのユーザーが投稿したのか(idとname)も取得する
"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicCards() {
  try {
    const cards = await prisma.card.findMany({
      where: {
        isPublic: true, // 公開カード
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // 新しい順
      },
    });
    return cards;
  } catch (error) {
    console.error("公開カードの取得に失敗しました:", error);
    return [];
  }
}
