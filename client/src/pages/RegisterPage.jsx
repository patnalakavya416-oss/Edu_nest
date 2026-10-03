// pages/RegisterPage.jsx
// Student registration — name, email, password.
// Logic: registerUser() API, redirect to /login on success.
// All unchanged from before; only visual presentation updated.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await registerUser(form.name, form.email, form.password);
      setSuccess("Account created! Redirecting to sign in…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
            Start your academic<br />
            <span>journey today.</span>
          </h2>
          <p className="auth-hero-desc">
            Create a free account to access notes, previous papers,
            lab manuals, and AI-powered academic assistance.
          </p>
        </div>

        <div className="auth-features">
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Free access to all academic resources
          </div>
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Filter by department, year, and semester
          </div>
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Ask the AI assistant academic questions
          </div>
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Bookmark resources for quick access
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel-right">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Create account</h1>
          <p className="auth-form-subtitle">
            Join EduNest AI and access your college&apos;s academic resources.
          </p>

          {error   && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

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
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Choose a strong password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <p className="form-hint">At least 6 characters</p>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: "11px", fontSize: "0.9rem" }}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="auth-divider" />

          <div className="auth-footer-links">
            <span>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--accent-dark)", fontWeight: 600 }}>
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
