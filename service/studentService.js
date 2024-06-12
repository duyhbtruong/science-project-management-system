export const getStudentAccount = async (id) => {
  const res = await fetch(`http://localhost:3000/api/students?id=${id}`, {
    method: "GET",
  });
  if (res) {
    return res.json();
  }
};

export const postStudentAccount = async (values) => {
  const res = await fetch(`http://localhost:3000/api/students/`, {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (res) {
    return res;
  }
};
