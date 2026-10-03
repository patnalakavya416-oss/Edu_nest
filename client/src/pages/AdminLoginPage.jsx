// pages/AdminLoginPage.jsx
// Admin login — uses the same /api/auth/login endpoint.
// After login, role is checked. Non-admins are rejected without saving session.
// Logic unchanged from before; only visual presentation updated.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(form.email, form.password);
      // Role check — only admin accounts may proceed
      if (data.user.role !== "admin") {
        setError("Admin access required. This account does not have admin privileges.");
        setLoading(false);
        return; // session NOT saved
      }
      login(data.user, data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left panel */}
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">📚</div>
          <div>
            <div className="auth-brand-name">EduNest AI</div>
            <div className="auth-brand-sub">Academic Hub</div>
          </div>
        </div>

        <div className="auth-hero">
          <h2 className="auth-hero-title">
            Repository<br />
            <span>Management Portal</span>
          </h2>
          <p className="auth-hero-desc">
            Upload, organise, and manage academic resources for students
            across departments, years, and semesters.
          </p>
        </div>

        <div className="auth-features">
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Upload PDFs, PPTs, and lab manuals
          </div>
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Manage departments and subjects
          </div>
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Create and manage administrator accounts
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel-right">
        <div className="auth-form-container">
          <div className="admin-portal-badge">
            <span>🔒</span>
            Admin Portal
          </div>

          <h1 className="auth-form-title">Admin Sign In</h1>
          <p className="auth-form-subtitle">
            Sign in with your administrator credentials to access the management panel.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Admin email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: "11px", fontSize: "0.9rem" }}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In as Administrator"}
            </button>
          </form>

          <div className="auth-divider" />

          <div className="auth-footer-links">
            <span>
              Not an administrator?{" "}
              <Link to="/login" style={{ color: "var(--accent-dark)", fontWeight: 600 }}>
                Student sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
