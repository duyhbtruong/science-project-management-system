import NavigationBar from "@/components/ui/technologyScience/nav-bar";

export default function TechnologyScienceLayout({ children }) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  );
}
