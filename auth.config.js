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

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ token, session }) {
      if (token.id && session.user) {
        session.user.id = token.id;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },

    async jwt({ token }) {
      const dbAccount = await getAccountByEmail(token.email);

      if (!dbAccount) return token;

      token.id = dbAccount._id;
      token.role = dbAccount.role;

      return token;
    },
  },
  providers: [],
};
