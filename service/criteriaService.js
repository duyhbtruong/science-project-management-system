export const getCriteria = async () => {
  try {
    const res = await fetch("/api/criteria", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to get criteria.");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const createCriteria = async (criteriaData) => {
  const res = await fetch(`/api/criteria`, {
    method: "POST",
    body: JSON.stringify(criteriaData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};

export const updateCriteria = async (id, updates) => {
  const res = await fetch(`/api/criteria/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};

export const deleteCriteria = async (id) => {
  const res = await fetch(`/api/criteria/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};

export const reorderCriteria = async (criteria) => {
  const res = await fetch(`/api/criteria/reorder`, {
    method: "PUT",
    body: JSON.stringify(criteria),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};
