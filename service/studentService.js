export const getStudentAccountByAccountId = async (id) => {
  const res = await fetch(`http://localhost:3000/api/students?id=${id}`, {
    method: "GET",
  });
  if (res) {
    return res.json();
  }
};

export const getStudentAccountById = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/students?studentId=${id}`,
      {
        method: "GET",
      }
    );
    if (res) {
      return res.json();
    }
  } catch (error) {
    return error;
  }
};

export const postStudentAccount = async (values) => {
  console.log(values);

  const res = await fetch(`http://localhost:3000/api/students/`, {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (res) {
    return res;
  }
};
