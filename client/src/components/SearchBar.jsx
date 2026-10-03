// components/SearchBar.jsx
// Filter bar for the resource list.
// Props:
//   filters        — { keyword, department, year, semester, resourceType }
//   onFilterChange — callback(updatedFilters)

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

export default function SearchBar({ filters, onFilterChange }) {
  // Generic handler — updates the named field and calls onFilterChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleClear = () => {
    onFilterChange({
      keyword:      "",
      department:   "",
      year:         "",
      semester:     "",
      resourceType: "",
    });
  };

  return (
    <div className="filter-bar">
      {/* Keyword search */}
      <div className="form-group">
        <label className="form-label">Search</label>
        <input
          type="text"
          name="keyword"
          className="form-input"
          placeholder="Keywords…"
          value={filters.keyword || ""}
          onChange={handleChange}
        />
      </div>

      {/* Department */}
      <div className="form-group">
        <label className="form-label">Department</label>
        <input
          type="text"
          name="department"
          className="form-input"
          placeholder="e.g. CSE"
          value={filters.department || ""}
          onChange={handleChange}
        />
      </div>

      {/* Year */}
      <div className="form-group">
        <label className="form-label">Year</label>
        <select
          name="year"
          className="form-select"
          value={filters.year || ""}
          onChange={handleChange}
        >
          <option value="">All years</option>
          {[1, 2, 3, 4].map((y) => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
      </div>

      {/* Semester */}
      <div className="form-group">
        <label className="form-label">Semester</label>
        <select
          name="semester"
          className="form-select"
          value={filters.semester || ""}
          onChange={handleChange}
        >
          <option value="">All semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>Sem {s}</option>
          ))}
        </select>
      </div>

      {/* Resource type */}
      <div className="form-group">
        <label className="form-label">Type</label>
        <select
          name="resourceType"
          className="form-select"
          value={filters.resourceType || ""}
          onChange={handleChange}
        >
          <option value="">All types</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Clear all filters */}
      <div className="form-group" style={{ alignSelf: "flex-end" }}>
        <button className="btn-secondary btn-small" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
