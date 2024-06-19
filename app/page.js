import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // Điều hướng user dựa theo role
  if (session.user.role === "admin") {
    redirect("/admin/accounts");
  }
  if (session.user.role === "student") {
    redirect("/student/topics");
  }
  if (session.user.role === "technologyScience") {
    redirect("/technologyScience/dashboard");
  }
  if (session.user.role === "appraise") {
    redirect("/appraise/dashboard");
  }
}
