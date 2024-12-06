import NavigationBar from "@/components/ui/student/nav-bar";

export default function StudentLayout({ children }) {
  return (
    <div>
      <NavigationBar />
      <main>{children}</main>
    </div>
  );
}
