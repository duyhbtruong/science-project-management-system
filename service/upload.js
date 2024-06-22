export const uploadFile = async (topicId, fileRef) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/upload?topicId=${topicId}`,
      {
        method: "PUT",
        body: JSON.stringify(fileRef),
      }
    );
    if (res) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};
