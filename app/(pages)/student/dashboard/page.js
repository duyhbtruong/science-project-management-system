import { auth, signOut } from "@/auth";

const Dashboard = async () => {
  const session = await auth();
  return (
    <>
      <div>{JSON.stringify(session)}</div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/auth/login" });
        }}
      >
        <button>Đăng xuất</button>
      </form>
    </>
  );
};

export default Dashboard;
