export const postStudentAccount = async (values) => {
  const res = await fetch("http://localhost:3000/api/students/", {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (res) {
    return res;
  }
};
