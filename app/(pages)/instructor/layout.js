import NavigationBar from "@/components/ui/instructor/nav-bar";

export default function InstructorLayout({ children }) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  );
}
