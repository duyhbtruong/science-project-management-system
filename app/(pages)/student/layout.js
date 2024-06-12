import NavigationBar from "@/components/ui/student/nav-bar";
import { SessionProvider } from "next-auth/react";

export default function StudentLayout({ children }) {
  return (
    <SessionProvider>
      <div>
        <NavigationBar />
        <main>{children}</main>
      </div>
    </SessionProvider>
  );
}
