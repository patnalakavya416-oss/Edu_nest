// pages/AdminDashboardPage.jsx
// Admin dashboard — UI redesign only.
// All API calls, state logic, role checks, and navigation unchanged:
//   getResources(), deleteResource(), getAdmins(), createAdmin()

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getResources, deleteResource } from "../api/resources";
import { getAdmins, createAdmin } from "../api/auth";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Resource state ──────────────────────────────────────────
  const [resources, setResources]   = useState([]);
  const [resLoading, setResLoading] = useState(true);
  const [resError, setResError]     = useState("");

  // ── Admin list state ─────────────────────────────────────────
  const [admins, setAdmins]               = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [adminsError, setAdminsError]     = useState("");

  // ── Create admin form state ───────────────────────────────────
  const [form, setForm]               = useState({ name: "", email: "", password: "" });
  const [formError, setFormError]     = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchResources = async () => {
    setResLoading(true);
    setResError("");
    try {
      const data = await getResources({});
      setResources(data.resources || []);
    } catch {
      setResError("Failed to load resources.");
    } finally {
      setResLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setAdminsLoading(true);
    setAdminsError("");
    try {
      const data = await getAdmins();
      setAdmins(data.admins || []);
    } catch {
      setAdminsError("Failed to load admin accounts.");
    } finally {
      setAdminsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource? This cannot be undone.")) return;
    try {
      await deleteResource(id);
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Failed to delete resource.");
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
    setFormSuccess("");
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setFormError("All fields are required.");
      return;
    }
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      await createAdmin(form.name, form.email, form.password);
      setFormSuccess(`Admin account created for ${form.email}`);
      setForm({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create admin.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-wrapper">

          {/* ── Page header ─────────────────────────────────── */}
          <div className="page-header">
            <div>
              <p style={{
                fontSize: "0.7rem", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "1px",
                color: "var(--accent-dark)", marginBottom: "4px",
              }}>
                Admin Panel
              </p>
              <h1>Repository Management</h1>
              <p>Signed in as <strong>{user?.name}</strong> · Manage academic resources and administrator accounts.</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate("/admin/add-resource")}
            >
              + Add New Resource
            </button>
          </div>

          {/* ── Stats ───────────────────────────────────────── */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-card-value">{resLoading ? "—" : resources.length}</div>
              <div className="stat-card-label">Total resources</div>
            </div>
            <div className="stat-card accent">
              <div className="stat-card-value">{adminsLoading ? "—" : admins.length}</div>
              <div className="stat-card-label">Administrator accounts</div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════
              SECTION 1 — Resource Management
              ════════════════════════════════════════════════════ */}
          <div style={{ marginBottom: "44px" }}>
            <div className="section-heading">
              <span>Resource Management</span>
              <button
                className="btn-accent btn-small"
                onClick={() => navigate("/admin/add-resource")}
              >
                + Add Resource
              </button>
            </div>

            {resError && <div className="alert alert-error">{resError}</div>}

            {resLoading ? (
              <div className="spinner-center"><div className="spinner" /></div>
            ) : resources.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📂</div>
                <h3>No resources yet</h3>
                <p>Click &ldquo;Add Resource&rdquo; above to upload the first academic resource.</p>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Subject</th>
                        <th>Department</th>
                        <th>Year / Sem</th>
                        <th>Type</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map((r) => (
                        <tr key={r._id}>
                          <td style={{ fontWeight: 600, color: "var(--primary)", maxWidth: 240 }}>
                            {r.title}
                          </td>
                          <td style={{ color: "var(--text-secondary)" }}>{r.subject}</td>
                          <td style={{ color: "var(--text-secondary)" }}>{r.department}</td>
                          <td style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                            Y{r.year} · S{r.semester}
                          </td>
                          <td><span className="badge">{r.resourceType}</span></td>
                          <td>
                            <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                              <button
                                className="btn-secondary btn-small"
                                onClick={() => navigate(`/admin/edit-resource/${r._id}`)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-danger btn-small"
                                onClick={() => handleDelete(r._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════════
              SECTION 2 — Admin Management
              ════════════════════════════════════════════════════ */}
          <div>
            <div className="section-heading">
              <span>Administrator Accounts</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

              {/* Create admin form */}
              <div className="card">
                <p style={{
                  fontSize: "0.7rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.8px",
                  color: "var(--text-secondary)", marginBottom: "14px",
                }}>
                  Create New Administrator
                </p>

                {formError   && <div className="alert alert-error">{formError}</div>}
                {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

                <form onSubmit={handleCreateAdmin}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="admin-name">Full Name</label>
                    <input
                      id="admin-name"
                      name="name"
                      type="text"
                      className="form-input"
                      placeholder="Administrator name"
                      value={form.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="admin-email">Email</label>
                    <input
                      id="admin-email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="admin@example.com"
                      value={form.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="admin-password">Password</label>
                    <input
                      id="admin-password"
                      name="password"
                      type="password"
                      className="form-input"
                      placeholder="Choose a password"
                      value={form.password}
                      onChange={handleFormChange}
                      required
                      minLength={6}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={formLoading}
                    style={{ width: "100%" }}
                  >
                    {formLoading ? "Creating account…" : "Create Administrator"}
                  </button>
                </form>
              </div>

              {/* Existing admins list */}
              <div className="card">
                <p style={{
                  fontSize: "0.7rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.8px",
                  color: "var(--text-secondary)", marginBottom: "14px",
                }}>
                  Current Administrators ({admins.length})
                </p>

                {adminsError && <div className="alert alert-error">{adminsError}</div>}

                {adminsLoading ? (
                  <div className="spinner-center" style={{ padding: "24px" }}>
                    <div className="spinner" />
                  </div>
                ) : admins.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    No administrator accounts found.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {admins.map((a) => (
                      <div key={a._id} className="admin-list-item">
                        <div className="admin-list-avatar">
                          {a.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="admin-list-info">
                          <div className="admin-list-name">{a.name}</div>
                          <div className="admin-list-email">{a.email}</div>
                        </div>
                        <span className="badge badge-navy">admin</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
