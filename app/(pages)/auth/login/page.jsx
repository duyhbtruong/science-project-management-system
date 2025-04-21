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
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Sai tên đăng nhập hoặc mật khẩu." };
        default:
          return { error: "Có gì đó sai sai." };
      }
    }

    throw error;
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
          <Image src="/logo.svg" height={50} width={50} />
          <AppLogo fontSize={`text-3xl`} />
        </div>
        <LoginForm />
      </Card>
    </div>
  );
}
