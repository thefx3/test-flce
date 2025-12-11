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

  const { token } = await res.json();

  const meRes = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!meRes.ok) throw new Error("Admin session invalid");
  const me = await meRes.json();

  return { token, admin: me };
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


//GESTION DES COMPTES ADMINS

export async function getAllAdmins() {
  const admins = await fetch(`${API_BASE}/admin/admins`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });

  if (!admins.ok) {
    const err = await admins.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch admins.");
  }

  return admins.json();
}

export async function registerAdmin({ email, password, role="ADMIN"}) {
  const admin = await fetch(`${API_BASE}/admin/admins/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
    body: JSON.stringify({ email, password, role}),
  });

  if (!admin.ok) {
    const err = await admin.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create an admin.");
  }

  return admin.json();
}



// SECTION DES UTILISATEURS
export async function countAllTestsAdmin(){
  const res = await fetch(`${API_BASE}/admin/tests/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to count tests.");
  }

  return res.json(); // { count }
}

export async function countTestsToGradeAdmin(){
  const res = await fetch(`${API_BASE}/admin/tests/to-grade/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to count tests to grade.");
  }

  return res.json(); // { count }
}