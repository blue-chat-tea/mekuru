// メインページ(めぐる言葉)画面
export const dynamic = "force-dynamic";

import { getPublicCards } from "@/app/_actions/cardActions";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import ExploreClientContent from "@/components/ExploreClientContent"; // メイン画面用のクライアントコンポーネント
<Navigation activeTab="home" />;

export default async function ExplorePage() {
  // 全ユーザーの公開カードを新しい順で取得し表示する
  const cards = await getPublicCards();

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

      {/* 下部ナビゲーションバー */}
      <Navigation activeTab="home" />
    </div>
  );
}
