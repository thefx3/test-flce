import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import UsersPage from "./pages/Users.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";

export default function AdminRouter() {
  const { admin, loading } = useContext(AdminContext);

  if (loading) return <p>Loading…</p>;

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      {admin ? (
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}
