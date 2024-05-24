export const postTrainingAccount = async (values) => {
  const res = await fetch("http://localhost:3000/api/training/", {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (res) {
    return res;
  }
};
