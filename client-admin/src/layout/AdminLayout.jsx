import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css";
import { useState } from "react";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="admin-shell">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "sidebar-overlay--visible" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />
      <div className="admin-main">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className="admin-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
