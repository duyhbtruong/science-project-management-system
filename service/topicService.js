export const createTopic = async (formData) => {
  try {
    const res = await fetch(`http://localhost:3000/api/topics/`, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.status === 201) {
      return res.json();
    }
  } catch (error) {
    console.log(error);
  }
};
