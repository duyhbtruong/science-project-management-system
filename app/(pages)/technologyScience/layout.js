import NavigationBar from "@/components/ui/technologyScience/nav-bar";

export default function AdminLayout({ children }) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  );
}
