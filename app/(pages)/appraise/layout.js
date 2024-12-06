import NavigationBar from "@/components/ui/appraise/nav-bar";

export default function AppraiseLayout({ children }) {
  return (
    <div>
      <NavigationBar />
      <main>{children}</main>
    </div>
  );
}
