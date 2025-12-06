// client-admin/src/api/adminApi.js

const API_BASE = "http://localhost:3000"; // à adapter en prod

// ------------------------------
// LOGIN ADMIN
// ------------------------------
export async function adminLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Admin login failed.");
  }

  const data = await res.json();

  if (!data.user || (data.user.role !== "ADMIN" && data.user.role !== "SUPERADMIN")) {
    throw new Error("Access denied: this account is not an admin.");
  }

  return {
    token: data.token,
    admin: data.user,
  };
}

// ------------------------------
// CHECK ADMIN SESSION
// ------------------------------
export async function adminCheckSession(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Admin session invalid.");
  }

  const data = await res.json();

  if (!data.user || (data.user.role !== "ADMIN" && data.user.role !== "SUPERADMIN")) {
    throw new Error("Access denied.");
  }

  return { admin: data.user };
}
