export const getAppraiseById = async (appraiseId) => {
  try {
    const res = await fetch(`/api/appraises/${appraiseId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to get appraise by appraise id.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getAppraisesByAppraisalBoardId = async (
  periodId,
  appraisalBoardId
) => {
  try {
    const res = await fetch(
      `/api/appraises?periodId=${periodId}&appraisalBoardId=${appraisalBoardId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      throw new Error("Failed to get appraises by appraisal board id.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const createAppraise = async (values) => {
  try {
    const res = await fetch(`/api/appraises`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to create appraise.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const updateAppraiseById = async (appraiseId, values) => {
  try {
    const res = await fetch(`/api/appraises/${appraiseId}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to update appraise.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const deleteAppraiseById = async (appraiseId) => {
  try {
    const res = await fetch(`/api/appraises/${appraiseId}`, {
      method: "DELETE",
    });

    if (!res) {
      throw new Error("Failed to delete appraise.");
    }

    return res;
  } catch (error) {
    return error;
  }
};
