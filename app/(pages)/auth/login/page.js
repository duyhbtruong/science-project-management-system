"use server";

import { LoginForm } from "@/components/ui/login-form";
import { Card } from "antd";

import { signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { AppLogo } from "@/components/logo";

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
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Card className="shadow-md">
        <div className="text-2xl font-bold flex justify-center">
          <AppLogo fontSize={`text-3xl`} />
        </div>
        <LoginForm />
      </Card>
    </div>
  );
}
