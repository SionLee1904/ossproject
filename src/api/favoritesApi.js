const baseURL = "https://6915405a84e8bd126af939de.mockapi.io/favorites";


// 공통 응답 처리
async function handle(res, url, msg) {
  if (!res.ok) {
    const text = await res.text();
    console.error("[MockAPI ERROR]", {
      url,
      status: res.status,
      statusText: res.statusText,
      body: text,
    });
    throw new Error(msg);
  }
  return res.json();
}

// READ
export async function listFavorites(userId) {
  const url = baseURL;
  const res = await fetch(url);
  const data = await handle(res, url, "Failed to load favorites");
  return data.filter((f) => f.userId === userId);
}

// CREATE
export async function createFavorite(payload) {
  const url = baseURL;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res, url, "Failed to create favorite");
}

// UPDATE
export async function updateFavorite(id, patch) {
  const url = `${baseURL}/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return handle(res, url, "Failed to update favorite");
}

// DELETE
export async function deleteFavorite(id) {
  const url = `${baseURL}/${id}`;
  const res = await fetch(url, { method: "DELETE" });

  if (!res.ok) {
    const text = await res.text();
    console.error("[MockAPI DELETE ERROR]", {
      url,
      status: res.status,
      body: text,
    });
    throw new Error("Failed to delete favorite");
  }

  return true;
}