export const getFiles = async () => {
  try {
    const res = await fetch(`/api/upload`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to get files.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const searchFiles = async (search) => {
  try {
    const res = await fetch(`/api/upload?search=${search}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to search files.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const uploadFile = async (topicId, formData) => {
  try {
    const res = await fetch(`/api/upload/${topicId}`, {
      method: "PUT",
      body: formData,
    });

    if (!res) {
      throw new Error("Failed to upload file.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const deleteFile = async (topicId, fileType) => {
  try {
    const res = await fetch(`/api/upload/${topicId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileType }),
    });

    if (!res) {
      throw new Error("Failed to delete file.");
    }

    return res;
  } catch (error) {
    return error;
  }
};
