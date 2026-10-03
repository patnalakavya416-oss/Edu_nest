// pages/BookmarksPage.jsx
// Displays the logged-in student's saved resources.
// All bookmark loading and removal logic unchanged.

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ResourceCard from "../components/ResourceCard";
import { getMyBookmarks, removeBookmark } from "../api/bookmarks";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  const fetchBookmarks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyBookmarks();
      setBookmarks(data.bookmarks || []);
    } catch {
      setError("Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookmarks(); }, []);

  const handleRemove = async (resourceId) => {
    try {
      await removeBookmark(resourceId);
      setBookmarks((prev) =>
        prev.filter((b) => (b.resource?._id || b.resource) !== resourceId)
      );
    } catch {
      alert("Failed to remove bookmark.");
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
              <h1>Saved Resources</h1>
              <p>Academic materials you have bookmarked for quick access.</p>
            </div>
            {bookmarks.length > 0 && (
              <span className="badge badge-navy" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>
                {bookmarks.length} saved
              </span>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="spinner-center"><div className="spinner" /></div>
          ) : bookmarks.length === 0 ? (
            /* ── Empty state ───────────────────────────────── */
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              padding: "64px 32px",
              textAlign: "center",
              maxWidth: "480px",
              margin: "0 auto",
            }}>
              <div style={{
                width: 64, height: 64,
                background: "var(--accent-light)",
                borderRadius: "var(--radius-lg)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "28px",
                margin: "0 auto 20px",
              }}>
                🔖
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)", marginBottom: "8px" }}>
                No bookmarks yet
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "20px" }}>
                When you find a useful resource, click the <strong>Save</strong> button on any
                resource card to bookmark it here for quick access later.
              </p>
              <a href="/resources" className="btn-primary btn-small">
                Browse Resources
              </a>
            </div>
          ) : (
            <div className="resource-grid">
              {bookmarks.map((b) => {
                const resource = b.resource;
                if (!resource || !resource._id) return null;
                return (
                  <ResourceCard
                    key={b._id}
                    resource={resource}
                    onBookmark={handleRemove}
                    isBookmarked={true}
                  />
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
