export const getAllStudents = async () => {
  try {
    const res = await fetch(`/api/students`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch students.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const searchStudents = async (searchValues) => {
  try {
    const res = await fetch(`/api/students?search=${searchValues}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch students.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const getStudentById = async (id) => {
  try {
    const res = await fetch(`/api/students/${id}`, {
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

export const createStudent = async (values) => {
  try {
    const res = await fetch(`/api/students`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to create student.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const updateStudentById = async (id, values) => {
  try {
    const res = await fetch(`/api/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    if (!res) {
      throw new Error("Failed to update student.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const deleteStudentById = async (id) => {
  try {
    const res = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    if (!res) {
      throw new Error("Failed to delete student.");
    }

    return res;
  } catch (error) {
    return error;
  }
};
