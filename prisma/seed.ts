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
          "本を読み、抜き書きをすると、自分の愛してやまないもの、大切に思っている価値が、はっきり形をとるようになる。。",
        bookTitle: "百冊で耕す",
        authorName: "加藤耕太郎",
        userId: user.id,
      },
      {
        quote: "自分を物語のように話せば、それもそんなに悪いことでもなくなる。",
        bookTitle: "灯台守の話",
        authorName: "ジャネットウィンターソン",
        userId: user.id,
      },
      {
        quote:
          "みんながみんなを思いやって行動する「利他」の方が、社会のトータルの幸せが上がる。それがゲーム理論から証明できるのです。",
        bookTitle: "とんでもなく役に立つ数学",
        authorName: "西成活裕",
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
