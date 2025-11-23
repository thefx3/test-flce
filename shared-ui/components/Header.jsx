import { useContext } from 'react';
import ProfileMenu from './ProfileMenu';
import { AuthContext } from '../contexts/AuthContext';
import './Header.css';

export default function Header() {

  const { user } = useContext(AuthContext);

  return (
    <header className="main-header">
      <div className="badges">
        <div className="logo">🌐</div>
        <span className="brand">Blog API</span>
      </div>

      <nav className="nav-links">

        <a href="/">Home</a>

        {/* ---------- NOT LOGGED IN ---------- */}
        {!user && (
          <>
            <a href="/login">Log in</a>
            <a href="/register">Sign up</a>
          </>
        )}

        {/* ---------- LOGGED IN ---------- */}
        {user && (
          <ProfileMenu user={user} />
        )}

      </nav>
    </header>
  );
}
