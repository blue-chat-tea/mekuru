// 認証の窓口
// NextAuth.js（認証ライブラリ）のAPIルートを設定し、すべての認証リクエストをまとめて受け付けるエンドポイント
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
