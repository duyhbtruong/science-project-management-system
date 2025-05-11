export const getAllInstructors = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/instructors`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch instructors.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getAllInstructorsByFaculty = async (faculty) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/instructors?faculty=${faculty}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch instructors.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const searchInstructors = async (searchValues) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/instructors?search=${searchValues}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch instructors.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getInstructorById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/instructors/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const createInstructor = async (values) => {
  try {
    const res = await fetch(`http://localhost:3000/api/instructors`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to craete instructor.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const updateInstructorById = async (id, values) => {
  try {
    const res = await fetch(`http://localhost:3000/api/instructors/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to update instructor.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const deleteInstructorById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/instructors/${id}`, {
      method: "DELETE",
    });

    if (!res) {
      throw new Error("Failed to delete instructor.");
    }

    return res;
  } catch (error) {
    return error;
  }
};
