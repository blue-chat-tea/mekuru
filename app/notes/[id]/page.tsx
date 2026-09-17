import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import NotesClientContent from "@/components/NotesClientContent";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserNotesPage({ params }: PageProps) {
  const { id } = await params;

  // 1. セッション（ログイン中のユーザー）を取得
  const session = await auth();
  const currentUserId = session?.user?.id;

  // 2. URLのIDに対応するユーザーと、そのカードを登録が新しい順（createdAt desc）で取得
  const profileUser = await prisma.user.findUnique({
    where: { id },
    include: {
      cards: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // ユーザーが存在しない場合は404を表示
  if (!profileUser) {
    notFound();
  }

  // 本人かどうかを判定
  const isOwner = currentUserId === profileUser.id;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2]">
      {/* 共通ヘッダー */}
      <Header />

      {/* メインコンテンツエリア */}
      <main className="flex flex-1 flex-col items-center px-6 py-6 pb-24">
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          {isOwner ? "マイノート" : `${profileUser.name}さんのノート`}
        </h1>

        {/* NotesClientContent に isOwner などを渡す */}
        <NotesClientContent
          cards={profileUser.cards}
          userName={profileUser.name}
          isOwner={isOwner} // ★ ここを追加
        />
      </main>

      {/* 下部ナビゲーションバー（共通化） */}
      <Navigation activeTab="notes" />
    </div>
  );
}
