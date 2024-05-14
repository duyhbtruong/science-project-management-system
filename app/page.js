import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  // return <>{JSON.stringify(session.user.role)}</>;

  if (session.user.role === "admin") {
    redirect("/admin/dashboard");
  }
  if (session.user.role === "student") {
    redirect("/student/dashboard");
  }
  if (session.user.role === "instructor") {
    redirect("/instructor/dashboard");
  }
  if (session.user.role === "training") {
    redirect("/training/dashboard");
  }
  if (session.user.role === "appraise") {
    redirect("/appraise/dashboard");
  }
}
