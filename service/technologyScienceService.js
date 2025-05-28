export const getAllTechnologyScience = async () => {
  try {
    const res = await fetch(`/api/technology-sciences`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to fetch technology sciences.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const searchTechnologySciences = async (searchValues) => {
  try {
    const res = await fetch(`/api/technology-sciences?search=${searchValues}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to search technology sciences.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getTechnologyScienceById = async (id) => {
  try {
    const res = await fetch(`/api/technology-sciences/${id}`);

    if (!res) {
      throw new Error("Failed to fetch technology science info.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const createTechnologyScience = async (values) => {
  try {
    const res = await fetch(`/api/technology-sciences`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to create technology science.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const updateTechnologyScienceById = async (id, values) => {
  try {
    const res = await fetch(`/api/technology-sciences/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to update student.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const deleteTechnologyScienceById = async (id) => {
  try {
    const res = await fetch(`/api/technology-sciences/${id}`, {
      method: "DELETE",
    });

    if (!res) {
      throw new Error("Failed to delete technology science.");
    }

    return res;
  } catch (error) {
    return error;
  }
};
