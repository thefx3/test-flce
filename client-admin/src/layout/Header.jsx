import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import "./Header.css";

export default function Header() {

    const { admin, loading, logout } = useContext(AdminContext);

    if (loading) return <p>Loading</p>

    return (
        <header className="admin-header">
        <h1>Saison 2025-2026</h1>

        <p>USER : {admin.userId}</p>
        <button onClick={logout}>Logout</button>
        </header>
    );
}
