// pages/ResourcesPage.jsx
// Resource browser — search, filter and bookmark resources.
// All API calls and state logic unchanged.

import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import ResourceCard from "../components/ResourceCard";
import { getResources } from "../api/resources";
import { getMyBookmarks, addBookmark, removeBookmark } from "../api/bookmarks";

export default function ResourcesPage() {
  const [resources, setResources]         = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
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
    } catch {
      setError("Failed to load resources.");
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

          {/* ── Page header ───────────────────────────────────── */}
          <div className="page-header">
            <div>
              <h1>Resource Library</h1>
              <p>Search and filter academic materials by department, year, semester, and type.</p>
            </div>
            {hasActiveFilters && (
              <button
                className="btn-secondary btn-small"
                onClick={() => setFilters({ keyword: "", department: "", year: "", semester: "", resourceType: "" })}
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* ── Search & filter bar ───────────────────────────── */}
          <SearchBar filters={filters} onFilterChange={setFilters} />

          {/* ── Results ──────────────────────────────────────── */}
          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="spinner-center"><div className="spinner" /></div>
          ) : resources.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📂</div>
              <h3>No resources found</h3>
              <p>
                {hasActiveFilters
                  ? "No resources match your current filters. Try broadening your search."
                  : "No resources have been added to the repository yet."}
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                {resources.length} resource{resources.length !== 1 ? "s" : ""}
                {hasActiveFilters ? " match your filters" : " in total"}
              </p>
              <div className="resource-grid">
                {resources.map((r) => (
                  <ResourceCard
                    key={r._id}
                    resource={r}
                    onBookmark={handleBookmark}
                    isBookmarked={bookmarkedIds.has(r._id)}
                    showAdminActions={false}
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
