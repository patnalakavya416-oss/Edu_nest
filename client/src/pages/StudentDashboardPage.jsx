// pages/StudentDashboardPage.jsx
// Student home dashboard — search, browse and bookmark resources.
// All data-fetching, filtering, and bookmark logic unchanged.

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import ResourceCard from "../components/ResourceCard";
import { getResources } from "../api/resources";
import { getMyBookmarks, addBookmark, removeBookmark } from "../api/bookmarks";

export default function StudentDashboardPage() {
  const { user } = useAuth();

  const [resources, setResources]         = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [totalCount, setTotalCount]       = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  const [filters, setFilters] = useState({
    keyword: "", department: "", year: "", semester: "", resourceType: "",
  });

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getResources(filters);
      setResources(data.resources || []);
      setTotalCount(data.count || 0);
    } catch {
      setError("Failed to load resources. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getMyBookmarks();
        const ids = new Set(
          (data.bookmarks || []).map((b) => b.resource?._id || b.resource)
        );
        setBookmarkedIds(ids);
      } catch { /* non-critical */ }
    };
    fetchBookmarks();
  }, []);

  const handleBookmark = async (resourceId) => {
    try {
      if (bookmarkedIds.has(resourceId)) {
        await removeBookmark(resourceId);
        setBookmarkedIds((prev) => { const n = new Set(prev); n.delete(resourceId); return n; });
      } else {
        await addBookmark(resourceId);
        setBookmarkedIds((prev) => new Set([...prev, resourceId]));
      }
    } catch { /* silent */ }
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-wrapper">

          {/* ── Welcome header ───────────────────────────────── */}
          <div style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
            borderRadius: "var(--radius-xl)",
            padding: "28px 32px",
            marginBottom: "28px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            <div>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginBottom: "6px" }}>
                Student Dashboard
              </p>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.3px", marginBottom: "4px" }}>
                Welcome back, {user?.name}
              </h1>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
                Browse, search, and save academic resources for your courses.
              </p>
            </div>
            <Link to="/ai" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "var(--accent)", color: "#fff", padding: "10px 18px",
              borderRadius: "var(--radius)", fontWeight: 700, fontSize: "0.85rem",
              textDecoration: "none", flexShrink: 0,
            }}>
              ✦ Ask AI Assistant
            </Link>
          </div>

          {/* ── Stats ────────────────────────────────────────── */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-card-value">{totalCount}</div>
              <div className="stat-card-label">
                {hasActiveFilters ? "Resources found" : "Total resources"}
              </div>
            </div>
            <div className="stat-card accent">
              <div className="stat-card-value">{bookmarkedIds.size}</div>
              <div className="stat-card-label">Saved bookmarks</div>
            </div>
            <div className="stat-card" style={{ flex: "0 0 auto", minWidth: 0 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                Quick links
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Link to="/bookmarks" className="btn-secondary btn-small">🔖 Bookmarks</Link>
                <Link to="/resources" className="btn-secondary btn-small">📄 All Resources</Link>
              </div>
            </div>
          </div>

          {/* ── Search & Filter ───────────────────────────────── */}
          <div className="section-heading">
            <span>Find Resources</span>
            {hasActiveFilters && (
              <button
                className="btn-secondary btn-small"
                onClick={() => setFilters({ keyword: "", department: "", year: "", semester: "", resourceType: "" })}
              >
                Clear filters
              </button>
            )}
          </div>

          <SearchBar filters={filters} onFilterChange={setFilters} />

          {/* ── Resource grid ─────────────────────────────────── */}
          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="spinner-center"><div className="spinner" /></div>
          ) : resources.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📂</div>
              <h3>No resources found</h3>
              <p>
                {hasActiveFilters
                  ? "Try adjusting your filters or clearing the search."
                  : "No resources have been added yet. Check back soon."}
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                Showing {resources.length} resource{resources.length !== 1 ? "s" : ""}
                {hasActiveFilters ? " matching your filters" : ""}
              </p>
              <div className="resource-grid">
                {resources.map((r) => (
                  <ResourceCard
                    key={r._id}
                    resource={r}
                    onBookmark={handleBookmark}
                    isBookmarked={bookmarkedIds.has(r._id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
