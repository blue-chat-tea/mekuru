import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 既存データのクリーンアップ（初期化）
  await prisma.card.deleteMany();
  await prisma.user.deleteMany();

  // 1. テストユーザーの作成
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      // パスワードハッシュ（ダミー）
      passwordHash:
        "$2b$10$epR40/uW5L.H7A/YxJv5O.xQ3Q7Y/U8Z0YxJv5O.xQ3Q7Y/U8Z0Y",
      name: "テスト読書家",
    },
  });

  // 2. テストカード（言葉）の作成
  await prisma.card.createMany({
    data: [
      {
        quote:
          "思考は言葉になり、言葉は行動になり、行動は習慣になり、習慣は性格になり、性格は運命になる。",
        bookTitle: "マーガレット・サッチャー 名言集",
        authorName: "マーガレット・サッチャー",
        userId: user.id,
      },
      {
        quote:
          "一冊の本を深く読むことは、千冊の本の表面をなぞるよりも、はるかに精神を肥沃にする。",
        bookTitle: "読書論",
        authorName: "ショウペンハウエル",
        userId: user.id,
      },
      {
        quote: "人間は、自分が考えたとおりの人間になる。",
        bookTitle: "自分を動かす",
        authorName: "デール・カーネギー",
        userId: user.id,
      },
    ],
  });

  console.log("シードデータの挿入完了!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
