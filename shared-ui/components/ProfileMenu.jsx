import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "./ProfileMenu.css";

export default function ProfileMenu({ user }) {

  const { logout, user: ctxUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const currentUser = user || ctxUser;
  const initial = (currentUser?.username || currentUser?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="profile-wrapper">
      <div className="profile-circle" onClick={() => setOpen(!open)}>
        {initial}
      </div>

      {open && (
        <div className="profile-dropdown">
          <a href="/profile" className="settings-btn">Settings</a>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      )}
    </div>
  );
}
