import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AdminsPage from "./pages/Admins.jsx";
import UsersPage from "./pages/Users.jsx";
import TestsPage from "./pages/Tests.jsx";
import GradesPage from "./pages/Grades.jsx";
import StatisticsPage from "./pages/Statistics.jsx";

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
          <Route path="/admins" element={<AdminsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}
