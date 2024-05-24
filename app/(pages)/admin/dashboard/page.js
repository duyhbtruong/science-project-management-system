import { auth, signOut } from "@/auth";

const Dashboard = async () => {
  const session = await auth();
  return <>Dashboard</>;
};

export default Dashboard;
