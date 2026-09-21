// 言葉の編集画面
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditCardForm from "@/components/EditCardForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCardPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth(); // ログイン情報を取得

  // 編集対象のカードをデータベースから取得
  const card = await prisma.card.findUnique({
    where: { id },
  });

  if (!card) {
    notFound();
  }

  // 作成者とログインユーザーが一致するかチェック
  if (card.userId !== session?.user?.id) {
    notFound(); // 404(Not Foundエラー)
  }

  return <EditCardForm card={card} />;
}
