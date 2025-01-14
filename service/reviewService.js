export const getReviewById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to get reviews by review id.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};

export const getReviewsByTopicId = async (topicId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/reviews?topicId=${topicId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!res) {
      throw new Error("Failed to get reviews by topic id.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};

export const updateReviewById = async (reviewId, values) => {
  try {
    const res = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to update review.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};

export const createReview = async (values) => {
  try {
    const res = await fetch(`http://localhost:3000/api/reviews`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to create review.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};

export const deleteReviewById = async (reviewId) => {
  try {
    const res = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (!res) {
      throw new Error("Failed to delete review.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};
