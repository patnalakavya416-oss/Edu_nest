// pages/LoginPage.jsx
// Student login — split layout matching the new design system.
// Logic: loginUser() API call, AuthContext login(), role-based redirect.
// All unchanged from before.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
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
      login(data.user, data.token);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left panel — branding */}
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
            Your academic resources,<br />
            <span>all in one place.</span>
          </h2>
          <p className="auth-hero-desc">
            Access notes, question papers, lab manuals, and more —
            organized by department, year, and subject. Powered by AI.
          </p>
        </div>

        <div className="auth-features">
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Centralized academic resource library
          </div>
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Smart search and filtering
          </div>
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            AI-powered academic assistant
          </div>
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Bookmark and revisit resources anytime
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-panel-right">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-subtitle">
            Sign in to your student account to access your resources.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
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
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="auth-divider" />

          <div className="auth-footer-links">
            <span>
              Don&apos;t have an account?{" "}
              <Link to="/register" style={{ color: "var(--accent-dark)", fontWeight: 600 }}>
                Create one
              </Link>
            </span>
            <Link to="/admin-login" className="auth-admin-link">
              <span>🔒</span>
              Administrator sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
