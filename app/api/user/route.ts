import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Auth.js のセッション取得
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

// ユーザー情報の更新 (ユーザー名 / パスワード)
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未認証のリクエストです" }, { status: 401 });
    }

    const { name, password } = await req.json();
    const updateData: { name?: string; passwordHash?: string } = {};

    if (name) updateData.name = name;
    if (password && password.length >= 8) {
      updateData.passwordHash = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ message: "更新が完了しました", user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

// アカウント削除 (退会処理)
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未認証のリクエストです" }, { status: 401 });
    }

    // Prisma Schema で onDelete: Cascade が入っていれば紐づくデータも削除されます
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ message: "アカウントを削除しました" });
  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
