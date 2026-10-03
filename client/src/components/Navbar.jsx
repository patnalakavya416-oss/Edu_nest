// components/Navbar.jsx
// Left sidebar navigation — adapts links based on auth state and role.
// All routing logic is unchanged; only visual presentation changes.

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // First letter of name for avatar
  const initials = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <nav className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <NavLink to="/" className="sidebar-logo">
          <div className="sidebar-logo-icon">📚</div>
          <div>
            <div className="sidebar-logo-text">EduNest AI</div>
            <div className="sidebar-logo-sub">Academic Hub</div>
          </div>
        </NavLink>
        {isAuthenticated && (
          <p className="sidebar-tagline">Your academic resources, all in one place.</p>
        )}
      </div>

      {/* Navigation links */}
      <div className="sidebar-nav">
        {isAuthenticated ? (
          <>
            <span className="sidebar-section-label">Navigation</span>

            {/* Dashboard link — points to admin or student */}
            <NavLink
              to={isAdmin ? "/admin" : "/dashboard"}
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-link-icon">⊞</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/resources"
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-link-icon">📄</span>
              <span>Resources</span>
            </NavLink>

            <NavLink
              to="/bookmarks"
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-link-icon">🔖</span>
              <span>Bookmarks</span>
            </NavLink>

            <NavLink
              to="/ai"
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-link-icon">✦</span>
              <span>AI Assistant</span>
            </NavLink>

            {/* Admin-only links */}
            {isAdmin && (
              <>
                <span className="sidebar-section-label" style={{ marginTop: "8px" }}>Admin</span>
                <NavLink
                  to="/admin/add-resource"
                  className={({ isActive }) =>
                    "sidebar-link" + (isActive ? " active" : "")
                  }
                >
                  <span className="sidebar-link-icon">＋</span>
                  <span>Add Resource</span>
                </NavLink>
              </>
            )}
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-link-icon">→</span>
              <span>Sign In</span>
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-link-icon">✎</span>
              <span>Register</span>
            </NavLink>
          </>
        )}
      </div>

      {/* Footer: user info + logout */}
      {isAuthenticated && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="admin-list-avatar" style={{ width: 28, height: 28, fontSize: "0.75rem" }}>
                {initials}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div className="sidebar-user-name">{user?.name}</div>
                <div className="sidebar-user-role">{user?.role}</div>
              </div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <span>⎋</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
