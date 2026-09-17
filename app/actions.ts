"use server";

import { prisma } from "@/lib/prisma"; // プロジェクトで使っているPrismaクライアントのパスに合わせて調整してください

export async function getPublicCards() {
  try {
    const cards = await prisma.card.findMany({
      where: {
        isPublic: true, // 公開されているもの
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
