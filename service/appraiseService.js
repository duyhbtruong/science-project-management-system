export const getAllAppraisalBoards = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/appraisal-boards`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to get all appraisal boards.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const searchAppraisalBoards = async (searchValues) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appraisal-boards?search=${searchValues}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      throw new Error("Failed to search appraisal boards.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getAppraisalBoardById = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appraisal-boards/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      throw new Error("Failed to fetch appraisal board info.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const createAppraisalBoard = async (values) => {
  try {
    const res = await fetch(`http://localhost:3000/api/appraisal-boards`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to create appraisal board.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const updateAppraisalBoardById = async (id, values) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appraisal-boards/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(values),
      }
    );

    if (!res) {
      throw new Error("Failed to update appraisal board.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const deleteAppraisalBoardById = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appraisal-boards/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res) {
      throw new Error("Failed to delete appraisal board.");
    }

    return res;
  } catch (error) {
    return error;
  }
};
