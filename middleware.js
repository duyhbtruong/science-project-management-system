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

  // Lấy user role để điều hướng
  const userRole = req.auth?.user.role;
  let callbackUrl;
  if (userRole) {
    callbackUrl = new URL(`/${userRole}/dashboard`, nextUrl);

    // Điều hướng đến trang admin
    if (nextUrl.pathname.startsWith(`/admin`) && userRole !== "admin") {
      return Response.redirect(new URL(`/admin/accounts`, nextUrl));
    }
    // Điều hướng đến trang student
    if (nextUrl.pathname.startsWith(`/student`) && userRole !== "student") {
      return Response.redirect(new URL(`/student/topics`, nextUrl));
    }
    // Điều hướng đến trang technology science
    if (
      nextUrl.pathname.startsWith(`/technologyScience`) &&
      userRole !== "technologyScience"
    ) {
      return Response.redirect(callbackUrl);
    }
    // Điều hướng đến trang appraise
    if (nextUrl.pathname.startsWith(`/appraise`) && userRole !== "appraise") {
      return Response.redirect(callbackUrl);
    }
  }

  // Nếu đã đăng nhập mà điều hướng đến trang auth thì redirect đến trang chính
  if (isAuthRoute) {
    if (isLoggedIn)
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    return null;
  }

  // Nếu chưa đăng nhập thì điều hướng đến trang đăng nhập
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null;
});

// Tất cả url match với config thì middleware sẽ chạy
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
