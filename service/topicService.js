export const createTopic = async (formData) => {
  try {
    const res = await fetch(`http://localhost:3000/api/topics/`, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!res) {
      throw new Error("Failed to register topic.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getTopics = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/topics`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to get topics.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getTopicsByPeriod = async (periodId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/topics?period=${periodId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      throw new Error("Failed to get topics by period.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getTopicById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/topics/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to get topic info.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getTopicsByInstructorId = async (selectedPeriod, instructorId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/topics?instructor=${instructorId}&period=${selectedPeriod}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      throw new Error("Failed to get topics by instructor.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getTopicsByReviewInstructorId = async (
  selectedPeriod,
  instructorId
) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/topics?reviewInstructor=${instructorId}&period=${selectedPeriod}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      throw new Error("Failed to get topics by review instructor.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getTopicsByAppraisalBoardStaffId = async (
  selectedPeriod,
  staffId
) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/topics?staffId=${staffId}&period=${selectedPeriod}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      throw new Error("Failed to get topics by review instructor.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const searchTopic = async (selectedPeriod, searchValue) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/topics?search=${searchValue.toUpperCase()}&period=${selectedPeriod}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to search topics.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const updateTopicById = async (id, values) => {
  try {
    const res = await fetch(`http://http://localhost:3000/api/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to update topic info.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const assignReviewInstructor = async (topicId, instructorId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/topics/${topicId}?review=${instructorId}`,
      {
        method: "PUT",
        body: JSON.stringify({}),
      }
    );

    if (!res) {
      throw new Error("Failed to assign review instructor.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const assignAppraisalBoard = async (topicId, appraisalBoardId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/topics/${topicId}?appraise=${appraisalBoardId}`,
      { method: "PUT", body: JSON.stringify({}) }
    );

    if (!res) {
      throw new Error("Failed to assign appraisal board.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const deleteTopicById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/topics/${id}`, {
      method: "DELETE",
    });

    if (!res) {
      throw new Error("Failed to delete topic.");
    }

    return res;
  } catch (error) {
    return error;
  }
};
