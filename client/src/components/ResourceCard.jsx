// components/ResourceCard.jsx
// Displays a single resource as a card.
// Props:
//   resource         — the resource object
//   onBookmark       — callback(resourceId) to toggle bookmark
//   isBookmarked     — boolean, controls bookmark button style
//   showAdminActions — boolean, shows Edit/Delete buttons for admins
//   onEdit           — callback(resourceId) for edit action
//   onDelete         — callback(resourceId) for delete action

import { Link } from "react-router-dom";

export default function ResourceCard({
  resource,
  onBookmark,
  isBookmarked,
  showAdminActions,
  onEdit,
  onDelete,
}) {
  if (!resource) return null;

  // Truncate description to 100 chars to keep card compact
  const shortDesc =
    resource.description && resource.description.length > 100
      ? resource.description.slice(0, 100) + "…"
      : resource.description;

  return (
    <div className="resource-card">
      {/* Header: title + resource type badge */}
      <div className="resource-card-header">
        <h3 className="resource-card-title">{resource.title}</h3>
        <span className="badge">{resource.resourceType}</span>
      </div>

      {/* Meta info */}
      <div className="resource-card-meta">
        <span>📂 {resource.department}</span>
        <span>📅 Year {resource.year}, Sem {resource.semester}</span>
        <span>📖 {resource.subject}</span>
      </div>

      {/* Description */}
      {shortDesc && (
        <p className="resource-card-description">{shortDesc}</p>
      )}

      {/* Action buttons */}
      <div className="resource-card-actions">
        {/* View detail page */}
        <Link
          to={`/resources/${resource._id}`}
          className="btn-secondary btn-small"
        >
          View
        </Link>

        {/* Bookmark toggle (shown to all logged-in users) */}
        {onBookmark && (
          <button
            className={`btn-bookmark btn-small${isBookmarked ? " bookmarked" : ""}`}
            onClick={() => onBookmark(resource._id)}
            title={isBookmarked ? "Remove bookmark" : "Bookmark this resource"}
          >
            {isBookmarked ? "🔖 Saved" : "🔖 Save"}
          </button>
        )}

        {/* Admin-only edit and delete buttons */}
        {showAdminActions && (
          <>
            <button
              className="btn-secondary btn-small"
              onClick={() => onEdit && onEdit(resource._id)}
            >
              Edit
            </button>
            <button
              className="btn-danger btn-small"
              onClick={() => onDelete && onDelete(resource._id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
