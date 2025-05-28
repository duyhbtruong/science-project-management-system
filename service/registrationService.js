export const getAllPeriods = async () => {
  try {
    const res = await fetch(`/api/registration-periods`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to get all periods.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const searchPeriods = async (searchedValues) => {
  try {
    const res = await fetch(
      `/api/registration-periods?search=${searchedValues}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      throw new Error("Failed to search periods.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getPeriodById = async (periodId) => {
  try {
    const res = await fetch(`/api/registration-periods/${periodId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to get period info.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const createPeriod = async (periodValues) => {
  try {
    const res = await fetch(`/api/registration-periods`, {
      method: "POST",
      body: JSON.stringify(periodValues),
    });

    if (!res) {
      throw new Error("Failed to create period.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const updatePeriodById = async (periodId, periodValues) => {
  try {
    const res = await fetch(`/api/registration-periods/${periodId}`, {
      method: "PUT",
      body: JSON.stringify(periodValues),
    });

    if (!res) {
      throw new Error("Failed to update period.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const deletePeriodById = async (periodId) => {
  try {
    const res = await fetch(`/api/registration-periods/${periodId}`, {
      method: "DELETE",
    });

    if (!res) {
      throw new Error("Failed to delete period.");
    }

    return res;
  } catch (error) {
    return error;
  }
};
