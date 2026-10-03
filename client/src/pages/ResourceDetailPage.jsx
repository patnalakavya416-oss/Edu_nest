// pages/ResourceDetailPage.jsx
// Full detail view for a single resource.
// Bookmark toggle, open-resource link, and all existing logic unchanged.

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getResourceById } from "../api/resources";
import { getMyBookmarks, addBookmark, removeBookmark } from "../api/bookmarks";

// Map resource types to a simple document icon character
const TYPE_ICON = {
  "Notes":               "📝",
  "Previous Papers":     "📋",
  "Lab Manuals":         "🧪",
  "PPTs":                "📊",
  "Assignments":         "✏️",
  "Important Questions": "❓",
  "Study Materials":     "📚",
  "Useful Links":        "🔗",
};

export default function ResourceDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [resource, setResource]         = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resourceData, bookmarkData] = await Promise.all([
          getResourceById(id),
          getMyBookmarks(),
        ]);
        setResource(resourceData.resource);
        const saved = (bookmarkData.bookmarks || []).some(
          (b) => (b.resource?._id || b.resource) === id
        );
        setIsBookmarked(saved);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load resource.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        await removeBookmark(id);
        setIsBookmarked(false);
      } else {
        await addBookmark(id);
        setIsBookmarked(true);
      }
    } catch {
      alert("Failed to update bookmark.");
    }
  };

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

  if (error) {
    return (
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <div className="page-wrapper">
            <div className="alert alert-error">{error}</div>
            <button className="back-btn" onClick={() => navigate(-1)}>← Go back</button>
          </div>
        </main>
      </div>
    );
  }

  // Resolve relative /uploads/... paths to backend origin
  const hasRealUrl  = resource?.fileUrl && resource.fileUrl !== "#";
  const resolvedUrl = hasRealUrl && resource.fileUrl.startsWith("/")
    ? `http://localhost:5000${resource.fileUrl}`
    : resource?.fileUrl;

  const icon = TYPE_ICON[resource?.resourceType] || "📄";

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-wrapper">

          {/* Back */}
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back to resources
          </button>

          {/* ── Resource header card ─────────────────────────── */}
          <div style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
            borderRadius: "var(--radius-xl)",
            padding: "28px 32px",
            marginBottom: "24px",
            color: "#fff",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
              {/* Type icon */}
              <div style={{
                width: 56, height: 56,
                background: "rgba(255,255,255,0.1)",
                borderRadius: "var(--radius-lg)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", flexShrink: 0,
              }}>
                {icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{
                    background: "var(--accent)", color: "#fff",
                    fontSize: "0.68rem", fontWeight: 700,
                    padding: "3px 10px", borderRadius: "var(--radius-sm)",
                    letterSpacing: "0.4px",
                  }}>
                    {resource.resourceType}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                    {resource.department} · Year {resource.year} · Sem {resource.semester}
                  </span>
                </div>

                <h1 style={{
                  fontSize: "1.4rem", fontWeight: 800,
                  letterSpacing: "-0.3px", lineHeight: 1.3,
                  marginBottom: "4px",
                }}>
                  {resource.title}
                </h1>

                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>
                  {resource.subject}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
                <button
                  className={`btn-bookmark${isBookmarked ? " bookmarked" : ""}`}
                  onClick={handleBookmarkToggle}
                  style={{ background: isBookmarked ? "var(--accent)" : "rgba(255,255,255,0.1)", borderColor: "transparent", color: "#fff" }}
                >
                  {isBookmarked ? "🔖 Saved" : "🔖 Save"}
                </button>
                {hasRealUrl && (
                  <a
                    href={resolvedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent"
                  >
                    Open Resource ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ── Details card ─────────────────────────────────── */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <div className="section-heading" style={{ marginBottom: "16px" }}>
              Resource Information
            </div>

            <div className="detail-grid">
              <div className="detail-row">
                <span className="detail-label">Department</span>
                <span className="detail-value">{resource.department}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Subject</span>
                <span className="detail-value">{resource.subject}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Year</span>
                <span className="detail-value">Year {resource.year}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Semester</span>
                <span className="detail-value">Semester {resource.semester}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Resource Type</span>
                <span className="detail-value">{resource.resourceType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Uploaded By</span>
                <span className="detail-value">
                  {resource.uploadedBy?.name || "—"}
                  {resource.uploadedBy?.email && (
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                      {" "}· {resource.uploadedBy.email}
                    </span>
                  )}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date Added</span>
                <span className="detail-value">
                  {new Date(resource.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </span>
              </div>
              {!hasRealUrl && (
                <div className="detail-row">
                  <span className="detail-label">File</span>
                  <span className="detail-value" style={{ color: "var(--text-secondary)" }}>
                    No downloadable file attached
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {resource.description && (
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <p style={{
                  fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "8px",
                }}>
                  Description
                </p>
                <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.7 }}>
                  {resource.description}
                </p>
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {hasRealUrl && (
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                Open Resource ↗
              </a>
            )}
            <button
              className={`btn-bookmark${isBookmarked ? " bookmarked" : ""}`}
              onClick={handleBookmarkToggle}
            >
              {isBookmarked ? "🔖 Remove Bookmark" : "🔖 Add Bookmark"}
            </button>
            <button className="btn-secondary" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
