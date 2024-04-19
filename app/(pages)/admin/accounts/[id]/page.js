import UpdateForm from "@/components/ui/admin/UpdateForm";

const getAccountById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/accounts/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to get account.");
    }

    return res.json();
  } catch (error) {
    console.log("Error: ", error);
  }
};

const UpdateAccount = async ({ params }) => {
  const id = params.id;
  const { account } = await getAccountById(id);
  const { _id, name, email, phone, password, role } = account;

  // console.log("Account: ", account);
  return (
    <UpdateForm
      id={_id}
      name={name}
      email={email}
      phone={phone}
      password={password}
      role={role}
    />
  );
};

export default UpdateAccount;
