import NavigationBar from "@/components/NavigationBar";

export default function Layout({ children }) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  );
}
