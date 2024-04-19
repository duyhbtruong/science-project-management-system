import { Button } from "antd";
import Table from "@/components/ui/admin/Table";

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

  // console.log("Accounts: ", accounts);

  return (
    <>
      <div className="mx-auto w-[800px] mt-4 space-y-4">
        <div>
          <Table accounts={accounts} />
        </div>
      </div>
    </>
  );
};

export default AccountsPage;
