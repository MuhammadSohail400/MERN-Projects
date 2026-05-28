import { useNavigate } from "react-router-dom";
import useEmployees from "../hooks/useEmployees";

const DEPARTMENTS = [
  "All Departments",
  "Engineering",
  "Marketing",
  "Sales",
  "Operations",
];

export default function Employees() {
  const navigate = useNavigate();
  const {
    employees, totalEmployees,
    search, onSearch,
    deptFilter, onDept,
    statusFilter, onStatus,
    currentPage, totalPages, onPageChange,
  } = useEmployees();

  return (
    <div>
      <div className="page-content">

        {/* ── Header ── */}
        <div className="page-header">
          <div>
            <div className="page-title">Employee Directory</div>
            <div className="page-sub">
              Manage your organization's talent and departmental growth.
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate("/employees/add")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="16" y1="11" x2="22" y2="11" />
            </svg>
            Add Employee
          </button>
        </div>

        {/* ── Filters ── */}
        <div className="filters-bar">

          {/* Search */}
          <div className="filter-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Department filter */}
          <select
            className="filter-select"
            value={deptFilter}
            onChange={(e) => onDept(e.target.value)}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

        </div>

        {/* ── Table ── */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                // No results
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--color-text-muted)" }}>
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    {/* Employee */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div className="emp-avatar" style={{ background: emp.avatarColor }}>
                          {emp.initials}
                        </div>
                        <div>
                          <div className="emp-name">{emp.name}</div>
                          <div className="emp-email">{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td>
                      <span className={`dept-tag ${emp.deptTag}`}>
                        {emp.department}
                      </span>
                    </td>

                    {/* Salary */}
                    <td style={{ fontWeight: 600 }}>{emp.salary} /yr</td>

                    {/* Status */}
                    <td>
                      <span className={`status-pill ${emp.status}`}>
                        <span className="status-dot" />
                        {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button className="btn-outline" style={{ height: "30px", padding: "0 10px", fontSize: "12px" }}>
                          Edit
                        </button>
                        <button className="btn-outline" style={{ height: "30px", padding: "0 10px", fontSize: "12px" }}>
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ── Pagination ── */}
          <div className="pagination">
            <div>
              Showing{" "}
              <strong>{employees.length}</strong> of{" "}
              <strong>{totalEmployees}</strong> employees
            </div>

            <div className="page-btns">
              {/* Prev */}
              <button
                className="page-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                className="page-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="footer">
        <div>&copy; 2024 NexusHR. Enterprise Intelligence.</div>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="#" style={{ color: "var(--color-text-secondary)", textDecoration: "none" }}>Support</a>
          <a href="#" style={{ color: "var(--color-text-secondary)", textDecoration: "none" }}>Privacy</a>
          <a href="#" style={{ color: "var(--color-text-secondary)", textDecoration: "none" }}>Documentation</a>
        </div>
      </footer>
    </div>
  );
}