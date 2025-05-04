export const getSections = async () => {
  const res = await fetch(`http://localhost:3000/api/sections`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};

export const createSection = async (title, order) => {
  const res = await fetch(`http://localhost:3000/api/sections`, {
    method: "POST",
    body: JSON.stringify({ title, order }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};

export const updateSection = async (id, updates) => {
  const res = await fetch(`http://localhost:3000/api/sections/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};

export const deleteSection = async (id) => {
  const res = await fetch(`http://localhost:3000/api/sections/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};

export const reorderSections = async (sections) => {
  const res = await fetch(`http://localhost:3000/api/sections/reorder`, {
    method: "PUT",
    body: JSON.stringify(sections),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }

  return res.json();
};
