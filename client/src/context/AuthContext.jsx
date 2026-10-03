// context/AuthContext.jsx
// Provides authentication state to the entire app.
// Persists token and user info in localStorage so sessions survive page refresh.

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "edunest_token";
const USER_KEY  = "edunest_user";

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // { id, name, email, role }
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);   // true while reading localStorage

  // On first mount, restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser  = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        // Corrupt data — clear it out
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }

    setLoading(false);
  }, []);

  /**
   * Save auth data to state and localStorage after a successful login.
   * @param {{ id, name, email, role }} userData
   * @param {string} authToken
   */
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  /** Clear auth data from state and localStorage on logout. */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Custom hook — import and call useAuth() in any component to access auth state. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}

export default AuthContext;
