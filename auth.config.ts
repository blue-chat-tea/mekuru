import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      if (isOnAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
        return true;
      }

      return isLoggedIn;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
