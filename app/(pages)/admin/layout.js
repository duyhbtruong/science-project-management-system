import NavigationBar from "@/components/ui/admin/nav-bar";

export default function AdminLayout({ children }) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  );
}
