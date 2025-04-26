import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

const ROLE_DEFAULT_PATH = {
  admin: "/admin/accounts",
  student: "/student/topics",
  instructor: "/instructor/topics",
  technologyScience: "/technologyScience/dashboard",
  appraise: "/appraise/topics",
};

export default auth(async (req) => {
  const { nextUrl: url } = req;

  // 1) Let NextAuth handle its own API‐auth routes
  if (url.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  // 2) Fetch token + derive login state & role
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;
  const userRole = token?.role;

  // 3) If visiting a NEXT‐AUTH page…
  if (authRoutes.includes(url.pathname)) {
    // → already logged in? send to dashboard
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, url));
    }

    // → else let them see login/register
    return NextResponse.next();
  }

  // 4) If not logged in AND not a public page, force login
  if (!isLoggedIn && !publicRoutes.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", url));
  }

  // 5) If logged in AND has a role, ensure they’re inside their role‐area
  if (isLoggedIn && userRole) {
    if (url.pathname === "/") {
      return NextResponse.next();
    }

    const base = `/${userRole}`;
    // If they’re outside of `/admin`, `/student`, etc.…
    if (!url.pathname.startsWith(base)) {
      // → send them to that role’s default path
      const dest = ROLE_DEFAULT_PATH[userRole] ?? DEFAULT_LOGIN_REDIRECT;
      return NextResponse.redirect(new URL(dest, url));
    }
  }

  return NextResponse.next();
});

// Tất cả url match với config thì middleware sẽ chạy
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
