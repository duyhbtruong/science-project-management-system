export const postInstructorService = async (values) => {
  const res = await fetch("http://localhost:3000/api/instructors/", {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (res) {
    return res;
  }
};
