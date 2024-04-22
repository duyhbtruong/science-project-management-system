import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/mongodb";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";

const getAccountByEmail = async (email) => {
  try {
    const res = await fetch(`http://localhost:3000/api/auth?email=${email}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch account.");
    } else {
      const { account } = await res.json();
      return account;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const account = await getAccountByEmail(email);
          if (!account) return null;
          const passwordsMatch = await bcrypt.compare(
            password,
            account.password
          );

          if (passwordsMatch) return account;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
});
