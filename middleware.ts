import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;

  // 1. キャッシュを無効化したい保護されたルートの判定
  const isProtectedRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname === "/create" ||
    nextUrl.pathname === "/settings" ||
    nextUrl.pathname.startsWith("/notes/");

  // 2. 未ログイン状態で保護されたページにアクセス（戻るボタン等含む）した場合は、
  // Auth.jsのconfigに沿って自動リダイレクトされるが、明示的にレスポンスを生成する
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    const response = NextResponse.redirect(loginUrl);

    // リダイレクトのレスポンスにもキャッシュ無効化を付与
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  const response = NextResponse.next();

  // 3. ログイン中の保護されたページの場合、キャッシュを残さないヘッダーを付与
  if (isProtectedRoute) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
