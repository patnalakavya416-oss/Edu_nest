// pages/AddResourcePage.jsx
// Admin-only resource upload form — UI redesign only.
// All logic unchanged: createResource() with FormData, validation,
// file state, success redirect, error handling.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createResource } from "../api/resources";

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

const INITIAL_FORM = {
  title:        "",
  description:  "",
  department:   "",
  year:         "",
  semester:     "",
  subject:      "",
  resourceType: "",
};

export default function AddResourcePage() {
  const navigate = useNavigate();

  const [form, setForm]       = useState(INITIAL_FORM);
  const [file, setFile]       = useState(null);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0] || null;
    setFile(selected);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.title || !form.department || !form.year ||
      !form.semester || !form.subject || !form.resourceType
    ) {
      setError("All fields except description are required.");
      return;
    }

    if (!file) {
      setError("Please select a PDF, PPT, or PPTX file to upload.");
      return;
    }

    setLoading(true);
    try {
      await createResource({
        ...form,
        year:     Number(form.year),
        semester: Number(form.semester),
        file,
      });
      setSuccess("Resource uploaded successfully! Redirecting…");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-wrapper">

          {/* ── Page header ───────────────────────────────────── */}
          <div className="page-header">
            <div>
              <p style={{
                fontSize: "0.7rem", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "1px",
                color: "var(--accent-dark)", marginBottom: "4px",
              }}>
                Admin · Resource Upload
              </p>
              <h1>Add New Resource</h1>
              <p>Upload an academic resource to the repository.</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate("/admin")}>
              ← Cancel
            </button>
          </div>

          {/* ── Alerts ──────────────────────────────────────── */}
          {error   && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

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
                  placeholder="e.g. Data Mining Unit 1 Notes"
                  value={form.title}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="description">
                  Description <span style={{ color: "var(--text-secondary)", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  placeholder="Brief description of what this resource covers…"
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
                    placeholder="e.g. CSE, ECE, MECH"
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
                    placeholder="e.g. Data Mining"
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

            {/* ── Section 3: File Upload ──────────────────────── */}
            <div className="form-section">
              <div className="form-section-title">File Upload</div>

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
                  <label className="form-label" htmlFor="file">
                    File <span style={{ color: "var(--danger)" }}>*</span>
                    <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400, marginLeft: "6px" }}>
                      PDF, PPT, or PPTX · max 10 MB
                    </span>
                  </label>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    className="form-input"
                    accept=".pdf,.ppt,.pptx"
                    onChange={handleFileChange}
                    required
                    style={{ cursor: "pointer" }}
                  />
                  {file && (
                    <p style={{
                      fontSize: "0.78rem",
                      color: "var(--accent-dark)",
                      marginTop: "6px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}>
                      <span>✓</span> {file.name}
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
                disabled={loading}
                style={{ padding: "11px 28px", fontSize: "0.9rem" }}
              >
                {loading ? "Uploading…" : "Upload Resource"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/admin")}
                disabled={loading}
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
