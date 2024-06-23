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

export const getTopics = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/topics`, {
      method: "GET",
      cache: "no-store",
    });

    if (res) {
      return res.json();
    }
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

    if (res.ok) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};

export const searchTopic = async (searchValue) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/topics?search=${searchValue.toUpperCase()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (res.ok) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};

export const deleteTopicById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/topics?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};
