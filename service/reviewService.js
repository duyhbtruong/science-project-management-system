export const createReview = async (values) => {
  try {
    const res = await fetch(`http://localhost:3000/api/review`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (res) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};

export const getReviewById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/review?id=${id}`, {
      method: "GET",
      cache: "no-cache",
    });
    if (res) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};

export const getReviewByTopicId = async (topicId, technologyScienceId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/review?topicId=${topicId}&technologyScienceId=${technologyScienceId}`,
      {
        method: "GET",
        cache: "no-cache",
      }
    );
    if (res) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};

export const deleteReviewByTopicId = async (topicId, technologyScienceId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/review?topicId=${topicId}&technologyScienceId=${technologyScienceId}`,
      {
        method: "DELETE",
      }
    );

    if (res) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};
