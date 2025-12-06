import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      const isPublicTest = window.location.pathname.startsWith('/test');

      // Skip auth fetch on public test flow or when no token is stored
      if (!token || isPublicTest) {
        setUser(null);
        return;
      }

      try {

        const res = await fetch('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Invalid or expired token → clear it so we stop spamming 403s
        if (res.status === 401 || res.status === 403) {
          logout();
          return;
        }

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        if (!cancelled) setUser(data);
      } catch (err) {
        if (!cancelled) setUser(null);
        console.error('Failed to fetch user', err);
      }
    }

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [token]);

  function login(newToken) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
