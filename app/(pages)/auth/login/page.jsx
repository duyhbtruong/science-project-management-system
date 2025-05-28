"use server";

import { LoginForm } from "@/app/(pages)/auth/login/login-form.jsx";
import { Card } from "antd";

import { signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { AppLogo } from "@/components/logo";
import Image from "next/image";

export const login = async (values) => {
  const { email, password } = values;
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Sai tên đăng nhập hoặc mật khẩu." };
        default:
          return { error: "Có gì đó sai sai." };
      }
    }
    return { error: "An unexpected error occurred." };
  }
};

export const logout = async () => {
  "use server";
  await signOut({ redirectTo: "/auth/login" });
};

export default async function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="shadow-md">
        <div className="flex justify-center text-2xl font-bold gap-x-2">
          <Image src="/logo.svg" alt="logo" height={50} width={50} />
          <AppLogo fontSize={`text-3xl`} />
        </div>
        <LoginForm />
      </Card>
    </div>
  );
}
