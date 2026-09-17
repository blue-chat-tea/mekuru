import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import ExploreClientContent from "@/components/ExploreClientContent"; // メイン画面用のクライアントコンポーネント
<Navigation activeTab="home" />;

export default async function ExplorePage() {
  // 1. 全ユーザーの公開カードを新しい順（createdAt desc）で取得し、ユーザー情報も結合する
  const cards = await prisma.card.findMany({
    where: {
      isPublic: true, // 公開設定のもののみ
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
      createdAt: "desc", // 登録日時が新しい順
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2]">
      {/* 共通ヘッダー */}
      <Header />

      {/* メインコンテンツエリア */}
      <main className="flex flex-1 flex-col items-center px-6 py-6 pb-24">
        <h1 className="text-xl font-bold text-gray-800 mb-6">めぐる言葉</h1>

        {/* カード一覧・スワイプ/ページネーションを管理するクライアントコンポーネント */}
        <ExploreClientContent cards={cards} />
      </main>

      {/* 下部ナビゲーションバー（アクティブタブを切り替え） */}
      <Navigation activeTab="home" />
    </div>
  );
}
