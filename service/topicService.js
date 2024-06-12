export const createTopic = async (formData) => {
  const res = await fetch(`http://localhost:3000/api/topics/`, {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (res) {
    return res.json();
  }
};
