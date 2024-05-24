export const postAppraiseAccount = async (values) => {
  const res = await fetch("http://localhost:3000/api/appraise/", {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (res) {
    return res;
  }
};
