import NavigationBar from "@/components/ui/training/nav-bar";

export default function AdminLayout({ children }) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  );
}
