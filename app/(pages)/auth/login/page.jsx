"use server";

import { LoginForm } from "@/app/(pages)/auth/login/login-form.jsx";
import { Card } from "antd";

import { signIn, signOut } from "@/auth";
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="shadow-md">
        <div className="flex gap-x-2 justify-center text-2xl font-bold">
          <Image
            src="/logo.svg"
            alt="logo"
            width="0"
            height="0"
            className="w-[50px] h-auto"
          />
          <AppLogo fontSize={`text-3xl`} />
        </div>
        <LoginForm />
      </Card>
    </div>
  );
}
