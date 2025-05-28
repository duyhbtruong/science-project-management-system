import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/mongodb";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";

const getAccountByEmail = async (email) => {
  try {
    const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
    console.log("Fetching account for email:", email);
    console.log("Using baseUrl:", baseUrl);

    const res = await fetch(`${baseUrl}/api/auth?email=${email}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch account. Status:", res.status);
      throw new Error("Failed to fetch account.");
    } else {
      const { account } = await res.json();
      console.log("Account found:", account ? "Yes" : "No");
      return account;
    }
  } catch (error) {
    console.error("Error fetching account:", error);
    return null;
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      authorize: async (credentials) => {
        console.log("Authorizing credentials:", credentials.email);

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const account = await getAccountByEmail(email);

          if (!account) {
            console.log("No account found for email:", email);
            return null;
          }

          console.log("Comparing passwords...");
          const passwordsMatch = await bcrypt.compare(
            password,
            account.password
          );
          console.log("Passwords match:", passwordsMatch);

          if (passwordsMatch) {
            console.log("Authentication successful for:", email);
            return account;
          }
        } else {
          console.log("Invalid credentials format:", parsedCredentials.error);
        }
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  debug: true, // Enable debug mode
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
});
