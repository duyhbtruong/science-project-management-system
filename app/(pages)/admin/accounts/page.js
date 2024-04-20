import { Button } from "antd";
import AccountTable from "@/components/ui/admin/AccountTable";

const getAccounts = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/accounts`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch accounts.");
    }
    return res.json();
  } catch (error) {
    console.log("Error: ", error);
  }
};

const AccountsPage = async () => {
  const accounts = await getAccounts();

  return (
    <>
      <div className="flex justify-center w-screen mt-8">
        <div className="w-[1000px]">
          <AccountTable accounts={accounts} />
        </div>
      </div>
    </>
  );
};

export default AccountsPage;
