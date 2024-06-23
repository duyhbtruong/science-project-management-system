import NavigationBar from "@/components/ui/appraise/nav-bar";
import { SessionProvider } from "next-auth/react";

export default function AppraiseLayout({ children }) {
  return (
    <SessionProvider>
      <div>
        <NavigationBar />
        <main>{children}</main>
      </div>
    </SessionProvider>
  );
}
