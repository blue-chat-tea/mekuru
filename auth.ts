import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // auth.config.ts の設定（secret, pages等）を継承
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
    ...authConfig.callbacks,
    // セッションにユーザーIDを追加で書き込む処理
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // サーバー側で作成される暗号トークン（jwt）に id を書き込む
        token.id = user.id;
        token.name = user.name;
      }

      // クライアント側で update({ name }) が実行された時に JWT トークン内の name を更新
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    },
  },
});
