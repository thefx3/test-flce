import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/users", label: "Utilisateurs" },
    { to: "/tests", label: "Tests" },
    { to: "/grade", label: "Correction" },
    { to: "/stats", label: "Statistiques" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">LA CLEF</div>

      <nav className="sidebar__nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
            end={link.to === "/"}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
