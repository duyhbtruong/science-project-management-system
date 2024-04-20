import NavigationBar from "@/components/nav-bar";

export default function AdminLayout({ children }) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  );
}
