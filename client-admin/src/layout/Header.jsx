import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

export default function Header() {

    const { admin, loading, login, logout } = useContext(AdminContext);

    return (
        <header className="admin-header">
        <h1>Admin Panel</h1>

        <button onClick={logout}>Logout</button>
        </header>
    );
}