import NavigationBar from "@/components/ui/technologyScience/nav-bar";
import { SessionProvider } from "next-auth/react";

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <NavigationBar />
      <main>{children}</main>
    </SessionProvider>
  );
}
