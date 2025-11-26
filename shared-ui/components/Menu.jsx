import { useLocation, useNavigate } from "react-router-dom";
import "./Menu.css";

export default function Menu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <div className="menu-buttons">

        {/* Home */}
        {pathname === "/test" ? (
          <button
            onClick={() => navigate("/")}
            className="menu-btn student-btn"
          >
        🏠 Home
        </button>
      ) : (
      <>
        {/* Results toggle */}
        <button
          onClick={() => navigate(pathname === "/results" ? "/" : "/results")}
          className="menu-btn student-btn"
        >
          {pathname === "/results" ? "🏠 Home" : "👤 My results"}
        </button>

        {/* Admin toggle */}
        <button
          onClick={() => navigate(pathname === "/admin" ? "/" : "/admin")}
          className="menu-btn admin-btn"
        >
          {pathname === "/admin" ? "🏠 Home" : "⚙️ Admin"}
        </button>

        </>
      )}

      </div>
    </div>
  );
}
