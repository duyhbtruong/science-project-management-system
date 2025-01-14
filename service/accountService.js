export const getAccounts = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/accounts`, {
      method: "GET",
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

export const searchAccounts = async (searchValues) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/accounts?search=${searchValues}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      throw new Error("Failed to search accounts.");
    }

    return res.json();
  } catch (error) {
    console.log("Error: ", error);
  }
};
