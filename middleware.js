import { NextResponse } from "next/server";
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
  "appraisal-board": "/appraisal-board/appraise",
};

export default auth(async (req) => {
  const { nextUrl: url } = req;
  const origin = url.origin;

  if (url.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  const session = await auth();
  const isLoggedIn = !!session;
  const userRole = session?.user?.role;

  if (authRoutes.includes(url.pathname)) {
    if (isLoggedIn) {
      const dest = ROLE_DEFAULT_PATH[userRole] ?? DEFAULT_LOGIN_REDIRECT;
      return NextResponse.redirect(new URL(dest, origin));
    }

    return NextResponse.next();
  }

  if (!isLoggedIn && !publicRoutes.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  if (isLoggedIn && userRole) {
    if (url.pathname === "/") {
      const dest = ROLE_DEFAULT_PATH[userRole] ?? DEFAULT_LOGIN_REDIRECT;
      return NextResponse.redirect(new URL(dest, origin));
    }

    const base = `/${userRole}`;
    if (!url.pathname.startsWith(base)) {
      const dest = ROLE_DEFAULT_PATH[userRole] ?? DEFAULT_LOGIN_REDIRECT;
      return NextResponse.redirect(new URL(dest, origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
