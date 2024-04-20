import NavigationBar from "@/components/nav-bar";

export default function Layout({ children }) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  );
}
