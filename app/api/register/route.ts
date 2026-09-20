// 新規登録処理
import { NextResponse } from "next/server"; // サーバーからブラウザへの返信
import { prisma } from "@/lib/prisma"; // データベースの呼び出し
import { hashPassword } from "@/lib/password"; // パスワードハッシュ化関数

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 項目ごとのエラーを格納するオブジェクト
    const errors: { [key: string]: string } = {};

    // 名前のチェック
    if (!name) errors.name = "ユーザー名を入力してください。";

    // メールアドレスのチェック（未入力チェック ＆ 重複チェック）
    if (!email) {
      errors.email = "メールアドレスを入力してください。";
    } else {
      // メールが入力されている場合のみ、DBに重複がないか問い合わせる
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        errors.email = "このメールアドレスは既に登録されています。";
      }
    }
    // パスワードのチェック
    if (!password) {
      errors.password = "パスワードを入力してください。";
    } else if (password.length < 8) {
      errors.password = "パスワードは8文字以上で入力してください。";
    }

    // エラーが1つでもあれば400で返す
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // パスワードのハッシュ化
    const hashedPassword = await hashPassword(password);

    // データベースへユーザーを作成・保存
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "ユーザー登録が完了しました。", user: newUser },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 },
    );
  }
}
