// 言葉の編集画面
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditCardForm from "@/components/EditCardForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCardPage({ params }: PageProps) {
  const { id } = await params;

  // 編集対象のカードをデータベースから取得
  const card = await prisma.card.findUnique({
    where: { id },
  });

  if (!card) {
    notFound();
  }

  return <EditCardForm card={card} />;
}
