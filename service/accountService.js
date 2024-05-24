export const getAccounts = async () => {
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

export const getAccountById = async (id) => {
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

export const deleteAccountById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/accounts?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete account!");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};
