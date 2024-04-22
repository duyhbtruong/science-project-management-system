"use server";

import { LoginForm } from "@/components/ui/login-form";
import { Card } from "antd";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

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
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }

    throw error;
  }
};

const LoginPage = async () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Card>
        <p className="text-2xl font-bold flex justify-center">Login</p>
        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage;
