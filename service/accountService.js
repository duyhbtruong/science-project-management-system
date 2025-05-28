export const getAccounts = async () => {
  try {
    const res = await fetch(`/api/accounts`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch accounts.");
    }

    return res;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getAccountById = async (accountId) => {
  try {
    const res = await fetch(`/api/accounts/${accountId}`, {
      method: "GET",
    });

    if (!res) {
      throw new Error("Failed to get account info.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const searchAccounts = async (searchValues) => {
  try {
    const res = await fetch(`/api/accounts?search=${searchValues}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to search accounts.");
    }

    return res;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const deleteAccountById = async (accountId) => {
  try {
    const res = await fetch(`/api/accounts/${accountId}`, {
      method: "DELETE",
    });

    if (!res) {
      throw new Error("Failed to delete account.");
    }

    return res;
  } catch (error) {
    return error;
  }
};
