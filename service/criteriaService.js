export const getCriteria = async () => {
  const res = await fetch(`http://localhost:3000/api/criteria`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};

export const createCriteria = async (criteriaData) => {
  const res = await fetch(`http://localhost:3000/api/criteria`, {
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
  const res = await fetch(`http://localhost:3000/api/criteria/${id}`, {
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
  const res = await fetch(`http://localhost:3000/api/criteria/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};

export const reorderCriteria = async (criteria) => {
  const res = await fetch(`http://localhost:3000/api/criteria/reorder`, {
    method: "PUT",
    body: JSON.stringify(criteria),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};
