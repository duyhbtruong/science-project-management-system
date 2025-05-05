export const uploadRegisterFile = async (topicId, registerFile) => {
  try {
    const res = await fetch(`http://localhost:3000/api/upload/${topicId}`, {
      method: "PUT",
      body: JSON.stringify({ registerFile }),
    });

    if (!res) {
      throw new Error("Failed to update register file reference.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};

export const uploadSubmitFile = async (topicId, submitFile) => {
  try {
    const res = await fetch(`http://localhost:3000/api/upload/${topicId}`, {
      method: "PUT",
      body: JSON.stringify({ submitFile }),
    });

    if (!res) {
      throw new Error("Failed to update submit file reference.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};

export const uploadContractFile = async (topicId, contractFile) => {
  try {
    const res = await fetch(`http://localhost:3000/api/upload/${topicId}`, {
      method: "PUT",
      body: JSON.stringify({ contractFile }),
    });

    if (!res) {
      throw new Error("Failed to update contract file reference.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};

export const uploadPaymentFile = async (topicId, paymentFile) => {
  try {
    const res = await fetch(`http://localhost:3000/api/upload/${topicId}`, {
      method: "PUT",
      body: JSON.stringify({ paymentFile }),
    });

    if (!res) {
      throw new Error("Failed to update payment file reference.");
    }

    return res.json();
  } catch (error) {
    return error;
  }
};

export const deleteRegisterFile = async (filePath) => {
  const res = await fetch(`http://localhost:3000/api/upload/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filePath }),
  });
  return res;
};
