export const postInstructorAccount = async (values) => {
  const res = await fetch("http://localhost:3000/api/instructor/", {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (res) {
    return res;
  }
};
