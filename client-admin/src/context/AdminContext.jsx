// client-admin/src/context/AdminContext.jsx
import { createContext, useState, useEffect } from "react";
import { adminLogin, adminCheckSession } from "../api/adminApi";

// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [loading, setLoading] = useState(true);

  // Vérifier session admin au chargement
  useEffect(() => {
    async function check() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await adminCheckSession(token);
        setAdmin(data.admin);
      } catch (err) {
        console.error("Admin session invalid:", err);
        localStorage.removeItem("adminToken");
        setToken("");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [token]);

  // Connexion admin
  async function login(email, password) {
    const { token, admin } = await adminLogin(email, password);

    localStorage.setItem("adminToken", token);
    setToken(token);
    setAdmin(admin);

    return { token, admin };
  }

  function logout() {
    localStorage.removeItem("adminToken");
    setToken("");
    setAdmin(null);
  }

  async function refreshAdmin() {
    if (!token) return null;
    try {
      const data = await adminCheckSession(token);
      setAdmin(data.admin);
      return data.admin;
    } catch (err) {
      console.error("Unable to refresh admin session:", err);
      return null;
    }
  }

  return (
    <AdminContext.Provider value={{ admin, token, login, logout, loading, refreshAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}
