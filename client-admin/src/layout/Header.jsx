import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import "./Header.css";

export default function Header() {

    const { loading, logout } = useContext(AdminContext);

    if (loading) return <p>Loading</p>

    return (
        <header className="admin-header">
        <h1>Saison 2025-2026</h1>

        <button onClick={logout}>Logout</button>
        </header>
    );
}
