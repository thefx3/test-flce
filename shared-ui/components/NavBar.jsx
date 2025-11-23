import { NavLink } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  const links = [
    { to: '/', label: 'Feed', end: true },
    { to: '/posts', label: 'My Posts' },
    { to: '/favorites', label: 'Favorites' },
  ];

  return (
    <nav className="nav-bar">
      {links.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
