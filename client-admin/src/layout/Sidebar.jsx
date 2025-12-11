import { NavLink } from "react-router-dom";
import { Home, Users, ListChecks, CheckCheck, BarChart2, UserRound, UserStar } from "lucide-react";
import "./Sidebar.css";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

export default function Sidebar() {
  const { admin } = useContext(AdminContext);
  const links = [
    { to: "/", label: "Dashboard", Icon: Home },
    { to: "/admin", label: "Admins", Icon: UserStar },
    { to: "/users", label: "Utilisateurs", Icon: Users },
    { to: "/tests", label: "Tests", Icon: ListChecks },
    { to: "/grades", label: "Corrections", Icon: CheckCheck },
    { to: "/stats", label: "Statistiques", Icon: BarChart2 },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <UserRound size={22} className="sidebar__avatar-icon" />
        <span>User {admin.userId}</span>
      </div>

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
            {link.Icon && <link.Icon size={18} className="sidebar__icon" />}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
