export const getAppraiseById = async (appraiseId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appraises/${appraiseId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      throw new Error("Failed to get appraise by appraise id.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};

export const getAppraisesByTopicId = async (topicId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appraises?topicId=${topicId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};

export const createAppraise = async (values) => {
  try {
    const res = await fetch(`http://localhost:3000/api/appraises`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to create appraise.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};

export const updateAppraise = async (appraiseId, values) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appraises/${appraiseId}`,
      {
        method: "PUT",
        body: JSON.stringify(values),
      }
    );

    if (!res) {
      throw new Error("Failed to update appraise.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};

export const deleteAppraiseById = async (appraiseId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appraises/${appraiseId}`,
      {
        method: "DELETE",
      }
    );

    if (!res) {
      throw new Error("Failed to delete appraise.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};
