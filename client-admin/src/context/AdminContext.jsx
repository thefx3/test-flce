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
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [token]);

  // Connexion admin
  async function login(email, password) {
    const data = await adminLogin(email, password);
    localStorage.setItem("adminToken", data.token);
    setToken(data.token);
    setAdmin(data.admin);
    return data.admin;
  }

  function logout() {
    localStorage.removeItem("adminToken");
    setAdmin(null);
    setToken("");
  }

  return (
    <AdminContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
}
