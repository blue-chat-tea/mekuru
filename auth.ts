import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // メールアドレスとパスワードでログインする
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // メールアドレスを使ってDBからユーザー情報を検索
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // ユーザーが存在するか確認する（存在しなければ認証失敗）
        if (!user || !user.passwordHash) {
          return null;
        }

        // 入力されたパスワードとDBのハッシュ化パスワードを照合する
        const isValid = await verifyPassword(password, user.passwordHash);

        // パスワード不一致なら認証失敗
        if (!isValid) {
          return null;
        }

        // 照合が成功したら、ユーザー情報を返してログイン成功（セッション発行）
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // カスタムログイン画面のパス
  },
  callbacks: {
    // セッションにユーザーIDを追加で書き込む処理
    async jwt({ token, user }) {
      if (user) {
        // サーバー側で作成される暗号トークン（jwt）に id を書き込む
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // ラウザや画面側で取得できるセッション情報（session）に id を受け渡す
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
