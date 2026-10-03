// pages/EditResourcePage.jsx
// Admin form to edit an existing resource — UI redesign only.
// All logic unchanged: getResourceById() to pre-fill, updateResource() to save,
// loading/saving/error states, navigation back to /admin.

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getResourceById, updateResource } from "../api/resources";

const RESOURCE_TYPES = [
  "Notes",
  "Previous Papers",
  "Lab Manuals",
  "PPTs",
  "Assignments",
  "Important Questions",
  "Study Materials",
  "Useful Links",
];

export default function EditResourcePage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form, setForm]       = useState(null); // null until fetched
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  // Fetch resource and pre-fill form
  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await getResourceById(id);
        const r = data.resource;
        setForm({
          title:        r.title        || "",
          description:  r.description  || "",
          department:   r.department   || "",
          year:         String(r.year  || ""),
          semester:     String(r.semester || ""),
          subject:      r.subject      || "",
          resourceType: r.resourceType || "",
          fileUrl:      r.fileUrl      || "",
        });
      } catch {
        setError("Failed to load resource data.");
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateResource(id, {
        ...form,
        year:     Number(form.year),
        semester: Number(form.semester),
      });
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update resource.");
      setSaving(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <div className="spinner-center"><div className="spinner" /></div>
        </main>
      </div>
    );
  }

  // ── Fatal error (no form data) ─────────────────────────────────
  if (error && !form) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <div className="page-wrapper">
            <div className="alert alert-error">{error}</div>
            <button className="btn-secondary" onClick={() => navigate("/admin")}>
              ← Back to Admin
            </button>
          </div>
        </main>
      </div>
    );
  }

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
                Admin · Edit Resource
              </p>
              <h1>Edit Resource</h1>
              <p>Update the details below and save your changes.</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate("/admin")}>
              ← Cancel
            </button>
          </div>

          {/* ── Inline error (form still shown) ─────────────── */}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ maxWidth: "720px" }}>

            {/* ── Section 1: Resource Information ───────────── */}
            <div className="form-section">
              <div className="form-section-title">Resource Information</div>

              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Title <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form-input"
                  value={form.title}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="description">
                  Description{" "}
                  <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ── Section 2: Academic Classification ─────────── */}
            <div className="form-section">
              <div className="form-section-title">Academic Classification</div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="department">
                    Department <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    className="form-input"
                    value={form.department}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subject">
                    Subject <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    className="form-input"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="year">
                    Year <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    className="form-select"
                    value={form.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select year</option>
                    {[1, 2, 3, 4].map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="semester">
                    Semester <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    className="form-select"
                    value={form.semester}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ── Section 3: File & Type ──────────────────────── */}
            <div className="form-section">
              <div className="form-section-title">Resource Type &amp; File</div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="resourceType">
                    Resource Type <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <select
                    id="resourceType"
                    name="resourceType"
                    className="form-select"
                    value={form.resourceType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select type</option>
                    {RESOURCE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="fileUrl">
                    File URL <span style={{ color: "var(--danger)" }}>*</span>
                    <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400, marginLeft: "6px" }}>
                      path or external link
                    </span>
                  </label>
                  <input
                    id="fileUrl"
                    name="fileUrl"
                    type="text"
                    className="form-input"
                    value={form.fileUrl}
                    onChange={handleChange}
                    required
                  />
                  {form.fileUrl && form.fileUrl !== "#" && (
                    <p style={{
                      fontSize: "0.78rem",
                      color: "var(--accent-dark)",
                      marginTop: "6px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}>
                      <span>✓</span> File attached
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Submit ──────────────────────────────────────── */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
                style={{ padding: "11px 28px", fontSize: "0.9rem" }}
              >
                {saving ? "Saving changes…" : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/admin")}
                disabled={saving}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
