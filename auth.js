import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { mongooseConnect } from "./lib/mongoose";
import { Account } from "./models/Account";
import bcrypt from "bcrypt";

const getUser = async (email) => {
  mongooseConnect();
  try {
    const user = await Account.findOne({ email });
    return user;
  } catch (error) {
    console.log("Failed to fetch user: ", error);
    throw new Error("Failed to fetch user.");
  }
};

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
        }
      },
    }),
  ],
});
