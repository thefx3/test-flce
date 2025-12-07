import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

export default function AdminRouter() {
  const { admin, loading } = useContext(AdminContext);

  if (loading) return <p>Loading…</p>;

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      {admin ? (
        <Route path="/" element={<DashboardPage />} />
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}
