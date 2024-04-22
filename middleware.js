import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return null;

  const userRole = req.auth?.user.role;
  let callbackUrl;
  if (userRole) {
    callbackUrl = new URL(`/${userRole}/dashboard`, nextUrl);
    // admin
    if (nextUrl.pathname.startsWith(`/admin`) && userRole !== "admin") {
      return Response.redirect(callbackUrl);
    }
    // student
    if (nextUrl.pathname.startsWith(`/student`) && userRole !== "student") {
      return Response.redirect(callbackUrl);
    }
    // instructor
    if (
      nextUrl.pathname.startsWith(`/instructor`) &&
      userRole !== "instructor"
    ) {
      return Response.redirect(callbackUrl);
    }
    // training department
    if (nextUrl.pathname.startsWith(`/training`) && userRole !== "training") {
      return Response.redirect(callbackUrl);
    }
    // appraise department
    if (nextUrl.pathname.startsWith(`/appraise`) && userRole !== "appraise") {
      return Response.redirect(callbackUrl);
    }
  }

  if (isAuthRoute) {
    if (isLoggedIn)
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
