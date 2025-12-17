import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { Menu } from "lucide-react";
import "./Header.css";

export default function Header({ setIsSidebarOpen }) {
  const { admin, loading, logout } = useContext(AdminContext);

  if (loading) return <p>Loading</p>;

  return (
    <header className="admin-header">
      
      {/* BOUTON BURGER EN MOBILE */}
      <button 
        className="header-burger"
        onClick={() => setIsSidebarOpen(prev => !prev)}
      >
        <Menu size={26} />
      </button>

      <h1>Saison 2025-2026</h1>

      <span>{admin.email}</span>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
