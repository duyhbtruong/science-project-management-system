export const getReviewById = async (id) => {
  try {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to get reviews by review id.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getReviewsByInstructorId = async (periodId, instructorId) => {
  try {
    const res = await fetch(
      `/api/reviews?periodId=${periodId}&instructorId=${instructorId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res) {
      throw new Error("Failed to get reviews by instructor id.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const createReview = async (values) => {
  try {
    const res = await fetch(`/api/reviews`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to create review.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const updateReviewById = async (reviewId, values) => {
  try {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to update review.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const deleteReviewById = async (reviewId) => {
  try {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (!res) {
      throw new Error("Failed to delete review.");
    }

    return res;
  } catch (error) {
    return error;
  }
};
